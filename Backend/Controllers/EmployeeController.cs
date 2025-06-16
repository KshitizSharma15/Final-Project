using Microsoft.AspNetCore.Mvc;
using CogniProject.Models;
using CogniProject.Services;
using CogniProject.Exceptions;
using Microsoft.AspNetCore.Authorization;
using CogniProject.Repositories;

namespace CogniProject.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [ApiException]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IAuthentication _auth;

        public EmployeeController(IEmployeeService employeeService, IAuthentication auth)
        {
            _employeeService = employeeService;
            _auth = auth;
        }

        [HttpGet]
        [Authorize(Roles = "Manager")]
        public IActionResult GetAllEmployees()
        {
            return Ok(_employeeService.GetAllEmployees());
        }

        [HttpGet("id")]
        [Authorize(Roles = "Manager,Employee")]
        public IActionResult GetEmployeeById(int id)
        {
            return Ok(_employeeService.GetEmployeeById(id));
        }

        [HttpPost]
        [Authorize(Roles = "Manager")]
        public IActionResult AddEmployee([FromBody] Employee employee)
        {
            return Ok(_employeeService.AddEmployee(employee));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public IActionResult UpdateEmployee(int id, [FromBody] Employee employee)
        {
            return Ok(_employeeService.UpdateEmployee(employee));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Manager")]
        public IActionResult DeleteEmployee(int id)
        {
           
            return Ok(_employeeService.DeleteEmployee(id));
        }

        [AllowAnonymous]
        [HttpPost("authentication")]
        public IActionResult AuthenticationCheck([FromBody] AuthenticationRequest request) //Use a specific request model
        {
            var token = _auth.AuthenticationUser(request.Email, request.Password);
            if (token == null)
                return Unauthorized();
            return Ok(token);
        }
    }

    public class AuthenticationRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
