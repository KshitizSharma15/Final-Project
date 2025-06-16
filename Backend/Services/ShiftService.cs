using System.Security.Claims;
using Azure.Core;
using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Repositories;
using Microsoft.AspNetCore.Http;

namespace CogniProject.Services
{
    public class ShiftService : IShiftService
    {
        private readonly IShiftRepository _shiftRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public ShiftService(IShiftRepository shiftRepository, IEmployeeRepository employeeRepository, IHttpContextAccessor httpContextAccessor)
        {
            _shiftRepository = shiftRepository;
            _employeeRepository = employeeRepository;
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

        public IEnumerable<Shift> GetAllShifts()
        {
            var result = _shiftRepository.GetAllShifts();
            if (result == null || !result.Any())
            {
                throw new NotFoundException("No Shifts found.");
            }
            return result;
        }

        public Shift GetShiftById(int id)
        {
            var shift = _shiftRepository.GetShiftById(id);
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole != "Manager" && shift.EmployeeID != currentUserId)
            {
                // Consider throwing NotFoundException instead of UnauthorizedAccessException for security
                throw new UnauthorizedException("You are not authorized to view this request.");
            }
            if (shift == null)
            {
                throw new NotFoundException($"Shift with ID {id} not found.");
            }
            return shift;
        }

        public IEnumerable<Shift> GetShiftByEmpId(int empid)
        {
            var employee = _employeeRepository.GetEmployeeById(empid);
            if (employee == null)
            {
                throw new NotFoundException($"Shift with EmployyeeID {empid} not found.");
            }
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole != "Manager" && employee.EmployeeID != currentUserId)
            {
                // Consider throwing NotFoundException instead of UnauthorizedAccessException for security
                throw new UnauthorizedException("You are not authorized to view this request.");
            }

            var shift = _shiftRepository.GetShiftByEmpId(empid);
            if (shift == null || !shift.Any())
            {
                throw new NotFoundException($"No Shifts found for Employee ID {empid}.");
            }
            return shift;
        }
        public int AddShift(Shift shift)
        {
            if (shift == null)
            {
                throw new BadRequestException("Shift data cannot be null.");
            }

            if (shift.EmployeeID == 0 || shift.ShiftDate == null || shift.ShiftTime == null)
            {
                throw new BadRequestException("All shift details are required.");
            }

            var employee = _employeeRepository.GetEmployeeById(shift.EmployeeID);
            if (employee == null)
            {
                throw new NotFoundException($"Employee with ID {shift.EmployeeID} not found.");
            }

            if (_shiftRepository.GetAllShifts().Any(s => s.EmployeeID == shift.EmployeeID && s.ShiftDate.Date == shift.ShiftDate.Date))
            {
                throw new ConflictException("Employee already has a shift on this date.");
            }

            return _shiftRepository.AddShift(shift);
        }

        public int UpdateShift(Shift shift)
        {
            if (shift == null)
            {
                throw new BadRequestException("Shift data cannot be null.");
            }

            var existingShift = _shiftRepository.GetShiftById(shift.ShiftID);
            if (existingShift == null)
            {
                throw new NotFoundException($"Shift with ID {shift.ShiftID} not found.");
            }

            return _shiftRepository.UpdateShift(shift);
        }

        public int DeleteShift(int id)
        {
            var shift = _shiftRepository.GetShiftById(id);
            if (shift == null)
            {
                throw new NotFoundException($"Shift with ID {id} not found.");
            }

            return _shiftRepository.DeleteShift(id);
        }
    }
}