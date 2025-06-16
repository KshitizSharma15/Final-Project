using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CogniProject.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [ApiException]
    public class LeaveRequestsController : ControllerBase
    {
        private readonly ILeaveRequestService _context;

        public LeaveRequestsController(ILeaveRequestService context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Manager")]
        public IActionResult GetAllLeaveRequest()
        {
            return Ok(_context.GetAllLeaveRequest());
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "Manager")]
        public ActionResult GetLeaveRequestById(int id)
        {
            return Ok(_context.GetLeaveRequestById(id));
        }

        [HttpGet("employee/{empid}")]
        [Authorize(Roles = "Employee,Manager")]
        public IActionResult GetLeaveRequestByEmpId(int empid)
        {
            return Ok(_context.GetLeaveRequestByEmpId(empid));
        }

        [HttpPost]
        [Authorize(Roles = "Employee")]
        public ActionResult AddLeaveRequest(LeaveRequest lRequest)
        {
            return Ok(_context.AddLeaveRequest(lRequest));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employee")]
        public IActionResult DeleteLeaveRequest(int id)
        {
            var result = _context.DeleteLeaveRequest(id);
            return NoContent();
        }


        [HttpGet("{employeeId}/leaveBalance/{leaveType}")]
        [Authorize(Roles = "Employee,Manager")]
        public IActionResult GetRemainingLeaveBalanceByEmpId(int employeeId, string leaveType)
        {
            return Ok(_context.GetRemainingLeaveBalanceByEmpId(employeeId, leaveType));
        }


        [HttpPut("{leaveId}/approve")]
        [Authorize(Roles = "Manager")]
        public IActionResult ApproveRequest(int leaveId)
        {
            return Ok(_context.ApproveRequest(leaveId,"Approved"));
        }

        [HttpPut("{leaveId}/reject")]
        [Authorize(Roles = "Manager")]
        public IActionResult RejectRequest(int leaveId)
        {
            return Ok(_context.RejectRequest(leaveId, "Rejected"));
        }
    }
}
