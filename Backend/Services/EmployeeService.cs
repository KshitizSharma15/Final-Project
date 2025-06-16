using System.Security.Claims;
using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Repositories;
using Microsoft.AspNetCore.Identity;

namespace CogniProject.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;


        public EmployeeService(IEmployeeRepository employeeRepository, IHttpContextAccessor httpContextAccessor)
        {
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

        public IEnumerable<Employee> GetAllEmployees()
        {
            var response = _employeeRepository.GetAllEmployees();
            if (response == null || !response.Any())
            {
                throw new NotFoundException("No Employee Found");
            }
            return response;
        }

        public Employee GetEmployeeById(int id)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee" && id != currentUserId)
            {
                throw new UnauthorizedException("You can only view your own Data.");
            }
            var employee = _employeeRepository.GetEmployeeById(id);
            if (employee == null)
            {
                throw new NotFoundException($"Employee with ID {id} not found.");
            }
            return employee;
        }

        public int AddEmployee(Employee employee)
        {

            if (employee.EmployeeID == 0 ||
                string.IsNullOrWhiteSpace(employee.EmployeeName) ||
                string.IsNullOrWhiteSpace(employee.EmployeeEmail) ||
                string.IsNullOrWhiteSpace(employee.Password) ||
                employee.EmployeePhoneNumber == 0)
            {
                throw new BadRequestException("Some Fields are missing");
            }


            if (_employeeRepository.GetAllEmployees().Any(e => e.EmployeeID == employee.EmployeeID))
            {
                throw new ConflictException($"Employee with EmployeeID '{employee.EmployeeID}' already exists.");
            }

            if (_employeeRepository.GetAllEmployees().Any(e => e.EmployeeEmail == employee.EmployeeEmail))
            {
                throw new ConflictException($"Employee with email '{employee.EmployeeEmail}' already exists.");
            }

            if (_employeeRepository.GetAllEmployees().Any(e => e.EmployeePhoneNumber == employee.EmployeePhoneNumber))
            {
                throw new ConflictException($"Employee with phone number '{employee.EmployeePhoneNumber}' already exists.");
            }

            return _employeeRepository.AddEmployee(employee);
        }

        public int UpdateEmployee(Employee employee)
        {
            if (employee == null)
            {
                throw new BadRequestException("Employee data cannot be null.");
            }
            var existingEmployee = _employeeRepository.GetEmployeeById(employee.EmployeeID);
            if (existingEmployee == null)
            {
                throw new NotFoundException($"Employee with ID {employee.EmployeeID} not found.");
            }
            return _employeeRepository.UpdateEmployee(employee);
        }

        public int DeleteEmployee(int id)
        {
            var employee = _employeeRepository.GetEmployeeById(id);
            if (employee == null)
            {
                throw new NotFoundException($"Employee with ID {id} not found.");
            }
            return _employeeRepository.DeleteEmployee(id);
        }
    }
}