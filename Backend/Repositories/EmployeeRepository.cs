using CogniProject.Data;
using CogniProject.Models;

namespace CogniProject.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ContextDb _context;

        public EmployeeRepository(ContextDb context)
        {
            _context = context;
        }

        public IEnumerable<Employee> GetAllEmployees()
        {
            return _context.Employees.ToList(); // Fetch from database
        }

        public Employee GetEmployeeById(int id)
        {
            return _context.Employees.FirstOrDefault(e => e.EmployeeID == id);
        }

        public int AddEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            return _context.SaveChanges(); // Save changes to database
        }

        public int UpdateEmployee(Employee employee)
        {
            var existingEmployee = GetEmployeeById(employee.EmployeeID);
            existingEmployee.EmployeeName = employee.EmployeeName;
            existingEmployee.EmployeeEmail = employee.EmployeeEmail;
            existingEmployee.EmployeePhoneNumber = employee.EmployeePhoneNumber;
            existingEmployee.Password = employee.Password;
            existingEmployee.Role = employee.Role;
            return _context.SaveChanges(); // Save updates
        }

        public int DeleteEmployee(int id)
        {
            var employee = GetEmployeeById(id);
            _context.Employees.Remove(employee);
            return _context.SaveChanges(); // Commit delete to database
        }
    }
}