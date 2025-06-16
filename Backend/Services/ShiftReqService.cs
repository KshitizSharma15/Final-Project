using Azure.Core;
using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Repositories;
using CogniProject.Repository;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace CogniProject.Services
{
    public class ShiftReqService : IShiftReqService
    {
        private readonly IShiftReqRepository _shiftReqRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IShiftService _shiftService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ShiftReqService(IShiftReqRepository shiftReqRepository, IEmployeeRepository employeeRepository, IShiftService shiftService, IHttpContextAccessor httpContextAccessor)
        {
            _shiftReqRepository = shiftReqRepository;
            _employeeRepository = employeeRepository;
            _shiftService = shiftService;
            _httpContextAccessor = httpContextAccessor;

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

        public IEnumerable<ShiftReq> GetAllRequests()
        {
            return _shiftReqRepository.GetAllRequests() ?? Enumerable.Empty<ShiftReq>();
        }

        public ShiftReq GetRequestById(int requestId) // Ownership check was correct
        {
            var request = _shiftReqRepository.GetRequestById(requestId);
            if (request == null)
            {
                throw new NotFoundException($"Shift Request with ID {requestId} not found.");
            }
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole != "Manager" && request.EmployeeID != currentUserId)
            {
            // Consider throwing NotFoundException instead of UnauthorizedAccessException for security
                throw new UnauthorizedException("You are not authorized to view this request.");
            }
            return request;
        }

        // Completely rewritten GetRequestByEmpId
        public IEnumerable<ShiftReq> GetRequestByEmpId(int empid)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            
            if (currentUserRole == "Employee" && empid != currentUserId)
            {
                // Throw NotFound or Unauthorized as you prefer
                throw new UnauthorizedException("You can only view your own shift requests.");
            }

            // Check if the target employee exists (Managers might request for non-existent IDs)
            var employee = _employeeRepository.GetEmployeeById(empid);
            if (employee == null)
            {
                throw new NotFoundException($"Employee with ID {empid} not found.");
            }

            // Fetch requests using the new repository method
            var requests = _shiftReqRepository.GetShiftReqByEmpId(empid);

            // Service decides if empty list warrants NotFound or just returns empty
            // if (requests == null || !requests.Any())
            // {
            //     throw new NotFoundException($"No Shift Requests found for Employee ID {empid}.");
            // }
            return requests ?? Enumerable.Empty<ShiftReq>(); // Return empty list if null
        }


        public int DeleteRequest(int requestId)
        {
            var request = _shiftReqRepository.GetRequestById(requestId);
            if (request == null)
            {
                throw new NotFoundException($"Shift Request with ID {requestId} not found.");
            }

            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole(); // Assuming Role isn't needed if only owner deletes

            // Ownership Check
            if (request.EmployeeID != currentUserId)
            {
                throw new UnauthorizedException("You are not authorized to delete this request.");
            }

            // --- ADDED: Status Check ---
            if (request.Status != "Pending")
            {
                throw new BadRequestException($"Cannot delete a request that is already {request.Status}.");
            }
            // --- END ADDED ---

            return _shiftReqRepository.DeleteRequest(requestId);
        }

        public int AddRequest(ShiftReq request)
        {
            if (request.EmployeeID == 0 || request.RequestedShiftDate == null || request.RequestedShiftTime == null)
            {
                throw new BadRequestException("All shift request details are required.");
            }

            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee" && request.EmployeeID != currentUserId)
            {
                throw new UnauthorizedException("You can only submit shift requests for yourself.");
            }

            var employee = _employeeRepository.GetEmployeeById(request.EmployeeID);
            if (employee == null)
            {
                throw new NotFoundException($"Shift with ID {request.EmployeeID} not found.");
            }
            if (_shiftReqRepository.GetAllRequests()
                .Any(s => s.EmployeeID == request.EmployeeID &&
                  s.RequestedShiftDate.Date == request.RequestedShiftDate.Date &&
                  s.Status == "Pending"))
            {
                throw new ConflictException("Employee already has a pending shift request on this date.");
            }
            return _shiftReqRepository.AddRequest(request);
        }
        public int ApproveRequest(int requestId, string status)
        {
            var request = _shiftReqRepository.GetRequestById(requestId);
            if (request == null)
            {
                throw new NotFoundException($"Shift Request with ID {requestId} not found.");
            }
            var newShift = new Shift
            {
                EmployeeID = request.EmployeeID,
                ShiftDate = request.RequestedShiftDate,
                ShiftTime = request.RequestedShiftTime
            };
            _shiftService.AddShift(newShift);

            return _shiftReqRepository.UpdateRequestStatus(requestId, status);
        }

        public int RejectRequest(int requestId, string status)
        {
            var request = _shiftReqRepository.GetRequestById(requestId);
            if (request == null)
            {
                throw new NotFoundException($"Shift Request with ID {requestId} not found.");
            }
            return _shiftReqRepository.UpdateRequestStatus(requestId, status);
        }
    }
}