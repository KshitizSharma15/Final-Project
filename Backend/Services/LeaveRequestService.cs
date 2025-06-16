using Azure.Core;
using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Repositories;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CogniProject.Services
{
    public class LeaveRequestService : ILeaveRequestService
    {
        private readonly ILeaveRequestRepository _repo;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly ILeaveBalanceService _leaveBalanceService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LeaveRequestService(ILeaveRequestRepository repo, IEmployeeRepository employeeRepo, ILeaveBalanceService leaveBalanceService,IHttpContextAccessor httpContextAccessor)
        {
            _repo = repo;
            _employeeRepo = employeeRepo;
            _leaveBalanceService = leaveBalanceService;
            _httpContextAccessor = httpContextAccessor;
        }

        private double CalculateLeaveDuration(DateOnly startDate, DateOnly endDate)
        {
            // Basic calculation: includes start and end date
            if (endDate < startDate) return 0;
            // +1 because if start=end, it's 1 day leave
            return (double)(endDate.DayNumber - startDate.DayNumber) + 1;
            // TODO: Enhance this later to exclude weekends/public holidays if required by policy
        }
        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue("employeeId");
            if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedException("User ID claim not found or invalid in token.");
        }

        private string GetCurrentUserRole()
        {
            var roleClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(roleClaim))
            {
                throw new UnauthorizedException("User Role claim not found in token.");
            }
            return roleClaim;
        }

        public IEnumerable<LeaveRequest> GetAllLeaveRequest()
        {
            var response = _repo.GetAllLeaveRequest();
            if (response == null || !response.Any())
            {
                throw new NotFoundException("No Leave Request Found.");
            }
            return response;
        }
        public LeaveRequest GetLeaveRequestById(int id)
        {
            var response = _repo.GetLeaveRequestById(id);
            if (response == null)
            {
                throw new NotFoundException($"Leave Request with leave id {id} does not exists");
            }
            return response;
        }
        public IEnumerable<LeaveRequest> GetLeaveRequestByEmpId(int empId)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee" && empId != currentUserId)
            {
                throw new NotFoundException($"Cannot find requests for Employee ID {empId}.");
            }

            var employee = _employeeRepo.GetEmployeeById(empId);
            if (employee == null)
            {
                throw new NotFoundException($"Employee with ID {empId} not found.");
            }

            var requests = _repo.GetLeaveRequestByEmpId(empId);
            return requests ?? Enumerable.Empty<LeaveRequest>();
        }
        public int AddLeaveRequest(LeaveRequest Lr)
        {
            if (Lr == null)
            {
                throw new BadRequestException("Leave Request data cannot be null");
            }
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee" && Lr.EmployeeId != currentUserId)
            {
                throw new UnauthorizedException("You can only submit leave requests for yourself.");
            }

            var employee = _employeeRepo.GetEmployeeById(Lr.EmployeeId);
            if (employee == null)
            {
                throw new NotFoundException($"Leave Request with id {Lr.EmployeeId} not found");
            }

            if (Lr.EndDate < Lr.StartDate)
            {
                throw new BadRequestException("End date cannot be before start date.");
            }

            double requestedDuration = CalculateLeaveDuration(Lr.StartDate, Lr.EndDate);
            if (requestedDuration <= 0)
            {
                throw new BadRequestException("Leave duration must be at least one day.");
            }
            LeaveBalance specificBalance;
            try
            {
                specificBalance = _leaveBalanceService.GetSpecificLeaveBalance(Lr.EmployeeId, Lr.LeaveType);
            }
            catch (NotFoundException)
            {
                throw new BadRequestException($"Leave balance not configured for Employee {Lr.EmployeeId}, Type {Lr.LeaveType}.");
            }

            if (specificBalance.Balance < requestedDuration)
            {
                throw new BadRequestException($"Insufficient leave balance for {Lr.LeaveType}. Available: {specificBalance.Balance}, Requested: {requestedDuration}");
            }
            if (Lr.LeaveType != "Annual")
            {
                LeaveBalance annualBalance;
                try
                {
                    annualBalance = _leaveBalanceService.GetSpecificLeaveBalance(Lr.EmployeeId, "Annual");
                }
                catch (NotFoundException)
                {
                    throw new BadRequestException($"Annual leave balance not configured for Employee {Lr.EmployeeId}.");
                }

                if (annualBalance.Balance < requestedDuration)
                {
                    throw new BadRequestException($"Insufficient Annual leave balance. Available Annual: {annualBalance.Balance}, Requested Duration: {requestedDuration}");
                }
            }

            if (_repo.GetAllLeaveRequest().Any(s => s.EmployeeId == Lr.EmployeeId &&
                                          s.Status != "Rejected" && // Check pending or approved
                                                                    // Basic overlap check (improve if needed):
                                          (Lr.StartDate <= s.EndDate && Lr.EndDate >= s.StartDate)))
            {
                throw new ConflictException("Leave request overlaps with an existing request for this period.");
            }
            return _repo.AddLeaveRequest(Lr);
        }
        public int DeleteLeaveRequest(int leaveId)
        {
            var request = _repo.GetLeaveRequestById(leaveId);
            if (request == null)
            {
                throw new NotFoundException($"Leave Request with ID {leaveId} not found.");
            }
            var currentUserId = GetCurrentUserId();
            if (request.EmployeeId != currentUserId)
            {
                throw new UnauthorizedException("You are not authorized to delete this request.");
            }
            if (request.Status == "Approved")
            {
                throw new BadRequestException($"Cannot delete a request that is already {request.Status}.");
            }
   
            return _repo.DeleteLeaveRequest(leaveId);
        }
        public string GetRemainingLeaveBalanceByEmpId(int employeeId, string leaveType)
        {
            var response = _repo.GetRemainingLeaveBalanceByEmpId(employeeId, leaveType);
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();
            if ((currentUserRole == "Employee" && currentUserRole == "Manager") || employeeId != currentUserId)
            {
                throw new UnauthorizedException("You can only view your own shift requests.");
            }
            if (response == null || !response.Any())
            {
                throw new NotFoundException($"No Leave Balance left for Employee id {employeeId}");
            }
            return response;
        }

        public int ApproveRequest(int LeaveId, string status)
        {
            var request = _repo.GetLeaveRequestById(LeaveId);
            if (request == null)
            {
                throw new NotFoundException($"Leave Request with ID {LeaveId} does not exist");
            }
            if (request.Status != "Pending")
            {
                throw new BadRequestException($"Request is already {request.Status}. Cannot approve again.");
            }

            double requestedDuration = CalculateLeaveDuration(request.StartDate, request.EndDate);
            if (requestedDuration <= 0)
            {
                throw new ConflictException("Invalid leave duration calculated during approval.");
            }
            bool specificDeductionSuccess = false;
            bool annualDeductionAttempted = false; // Flag to track if we need to check annual deduction
            bool annualDeductionSuccess = false;   // Flag to track outcome if attempted
            try
            {
                specificDeductionSuccess = _leaveBalanceService.DeductLeaveBalance(request.EmployeeId, request.LeaveType, requestedDuration);
                if (specificDeductionSuccess && request.LeaveType != "Annual")
                {
                    annualDeductionAttempted = true;
                    annualDeductionSuccess = _leaveBalanceService.DeductLeaveBalance(request.EmployeeId, "Annual", requestedDuration);
                }
                else if (request.LeaveType == "Annual")
                {
                    // If it *was* annual leave, no second deduction needed, proceed if specific one worked
                    annualDeductionAttempted = false; // Not attempted
                    annualDeductionSuccess = true;  // Considered successful for overall check
                }
            }
            catch (Exception ex)
            {
                // Catch exceptions from DeductLeaveBalance (e.g., NotFound, Insufficient)
                Console.WriteLine($"Error deducting leave balance during approval: {ex.Message}");
                // It's crucial *not* to update the status if deduction fails. Re-throw.
                throw new InvalidOperationException($"Failed to deduct leave balance for request {LeaveId}. Reason: {ex.Message}", ex);
            }
            // 3. Check if all necessary deductions were successful
            // If annual was attempted, both must be true. If only specific was needed, it must be true.
            bool allDeductionsSuccessful = specificDeductionSuccess && (!annualDeductionAttempted || annualDeductionSuccess);
            if (!allDeductionsSuccessful)
            {
                // If we get here, something went wrong with the deduction calls/logic (e.g., DeductLeaveBalance returned false unexpectedly)
                // It's critical not to approve the request.
                throw new InvalidOperationException($"Failed to deduct leave balance for request {LeaveId}. Balance update failed unexpectedly.");
            }
            // 4. Update status only AFTER ALL required balance deductions are successful
            return _repo.UpdateLeaveStatus(LeaveId, "Approved");
        }

        public int RejectRequest(int LeaveId, string status)
        {
            var request = _repo.GetLeaveRequestById(LeaveId);
            if(request == null)
            {
                throw new NotFoundException($"Leave Request with ID {LeaveId} not found");
            }
            if (request.Status != "Pending")
            {
                throw new BadRequestException($"Request is already {request.Status}. Cannot reject again.");
            }
            return _repo.UpdateLeaveStatus(LeaveId, "Rejected");
        }
    }
}
