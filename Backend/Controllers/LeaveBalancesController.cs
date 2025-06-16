using Microsoft.AspNetCore.Mvc;
using CogniProject.Models;
using CogniProject.Services;
using Microsoft.AspNetCore.Authorization;
using CogniProject.Exceptions;

namespace CogniProject.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [ApiException]
    public class LeaveBalancesController : ControllerBase
    {
        private readonly ILeaveBalanceService _service; // Renamed for clarity

        public LeaveBalancesController(ILeaveBalanceService service) // Renamed parameter
        {
            _service = service;
        }

        // GET: api/LeaveBalances (Get All - Should likely be Manager only)
        [HttpGet]
        [Authorize(Roles = "Manager")] // <-- ADDED Authorization
        public IActionResult GetLeaveBalances()
        {
            return Ok(_service.GetLb());
        }

        // GET: api/LeaveBalances/{balanceId} (Get by PK - Manager or maybe owner?)
        [HttpGet("{id}")]
        [Authorize(Roles = "Manager")]
        public IActionResult GetLeaveBalance(int id)
        {
            return Ok(_service.GetLb(id));
        }

        // GET: api/LeaveBalances/employee/{employeeId}/type/{leaveType}
        [HttpGet("employee/{employeeId}/type/{leaveType}")]
        [Authorize(Roles = "Manager, Employee")] // Both can potentially check balance
        public IActionResult GetSpecificBalance(int employeeId, string leaveType)
        {
            return Ok(_service.GetSpecificLeaveBalance(employeeId, leaveType));
        }

        // POST: api/LeaveBalances (Add initial balance - likely Manager/Admin only)
        [HttpPost]
        [Authorize(Roles = "Manager")] // <-- ADDED Authorization
        public IActionResult PostLeaveBalance([FromBody] LeaveBalance leaveBalance)
        {
            var result = _service.AddLb(leaveBalance);
            return Ok(result);
        }

        // GET: api/LeaveBalances/GetTotalLeaves/{LeaveType} (Get Leave config)
        [HttpGet("GetTotalLeaves/{leaveType}")]
        [AllowAnonymous]
        public IActionResult GetTotalLeaves(string leaveType)
        {
            return Ok(_service.GetTotalLeaves(leaveType));
        }
    }
}