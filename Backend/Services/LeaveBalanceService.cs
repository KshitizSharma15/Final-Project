using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Repositories;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CogniProject.Services
{
    public class LeaveBalanceService : ILeaveBalanceService
    {
        private readonly ILeaveBalanceRepository _repo;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public LeaveBalanceService(ILeaveBalanceRepository repo, IEmployeeRepository employeeRepo, IHttpContextAccessor httpContextAccessor)
        {
            _repo = repo;
            _employeeRepo = employeeRepo;
            _httpContextAccessor = httpContextAccessor;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue("employeeId");
            if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            // Consider specific exception or return value indicating error
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

        public LeaveBalance GetSpecificLeaveBalance(int employeeId, string leaveType)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee" && employeeId != currentUserId)
            {
                 throw new UnauthorizedAccessException("You can only view your own leave balances.");
            }
            var balance = _repo.GetBalanceByEmployeeAndType(employeeId, leaveType);
            if (balance == null)
            {
                throw new NotFoundException($"Leave balance not found for Employee ID {employeeId} and Type {leaveType}.");
            }
            return balance;
        }
        public bool DeductLeaveBalance(int employeeId, string leaveType, double durationToDeduct)
        {
            if (durationToDeduct <= 0)
            {
                throw new BadRequestException("Duration to deduct must be positive.");
            }

            var currentBalance = _repo.GetBalanceByEmployeeAndType(employeeId, leaveType);
            if (currentBalance == null)
            {
                throw new NotFoundException($"Leave balance not found for Employee ID {employeeId} and Type {leaveType}. Cannot deduct leave.");
            }

            if (currentBalance.Balance < durationToDeduct)
            {
                throw new BadRequestException($"Insufficient leave balance for {leaveType}. Available: {currentBalance.Balance}, Requested Deduction: {durationToDeduct}");
            }

            // Perform deduction
            currentBalance.Balance -= durationToDeduct;

            // Call repository to update the entity
            int rowsAffected = _repo.UpdateLb(currentBalance); // Use the clean Update method

            return rowsAffected > 0; // Return true if update was successful
        }
        public int AddLb(LeaveBalance Lb)
        {
            if (Lb == null || Lb.EmployeeId <= 0 || string.IsNullOrEmpty(Lb.LeaveType))
            {
                throw new BadRequestException("Valid EmployeeId and LeaveType are required to add leave balance.");
            }
            var employee = _employeeRepo.GetEmployeeById(Lb.EmployeeId);
            if (employee == null)
            {
                throw new NotFoundException($"Cannot add leave balance: Employee with ID {Lb.EmployeeId} not found.");
            }
            var existing = _repo.GetBalanceByEmployeeAndType(Lb.EmployeeId, Lb.LeaveType);
            if (existing != null)
            {
                throw new ConflictException($"Leave balance for Employee {Lb.EmployeeId} / Type {Lb.LeaveType} already exists.");
            }
            return _repo.AddLb(Lb);
        }
        public LeaveBalance GetLb(int id) // Get by BalanceId (PK)
        {
            LeaveBalance b = _repo.GetLbById(id); // Use repo method GetLbById
            if (b == null)
            {
                throw new NotFoundException($"Leave Balance record with ID {id} does not exist.");
            }
            return b;
        }

        public List<LeaveBalance> GetLb() // Get All
        {
            return _repo.GetLb();
        }

        public List<Leave> GetTotalLeaves(string leaveType) // Get Leave Config
        {
            return _repo.GetTotalLeaves(leaveType);
        }
    }
}
