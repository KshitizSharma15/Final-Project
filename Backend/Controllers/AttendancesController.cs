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
    public class AttendancesController : ControllerBase
    {
        private readonly IAttendanceService _context;
        private readonly IAuthentication _auth;

        public AttendancesController(IAttendanceService context, IAuthentication auth)
        {
            _context = context;
            _auth = auth;

        }

        [HttpGet]
        [Authorize(Roles = "Manager")]
        public IActionResult GetAttendances()
        {
            return Ok(_context.GetAttendances());

        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Manager")]
        public IActionResult GetAttendanceById(int id)
        {
            return Ok(_context.GetAttendanceById(id));
        }

        [HttpGet("employee/{empid}")]   
        [Authorize(Roles = "Manager,Employee")]
        public IActionResult GetAttendanceByEmpId(int empId)
        {
            return Ok(_context.GetAttendanceByEmpId(empId));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public IActionResult UpdateAttendanceRecord(int id, [FromBody] Attendance attendanceData)
        {
            attendanceData.AttendanceID = id;
            var updatedRecord = _context.UpdateAttendance(id, attendanceData);
            return Ok(updatedRecord);
        }

        [HttpPost]
        [Authorize(Roles = "Manager")]
        public IActionResult AddAttendance([FromBody] Attendance attendance)
        {
            return Ok(_context.AddAttendance(attendance));
        }

        [HttpGet("date/{date}")]
        [Authorize(Roles = "Manager,Employee")]
        public IActionResult GetAttendanceByDate(DateTime date)
        {
            return Ok(_context.GetAttendanceByDate(date));
        }

        [HttpGet("month/{month}/{year}")]
        [Authorize(Roles = "Manager,Employee")]
        public IActionResult GetAttendanceByMonth(int month, int year)
        {
            return Ok(_context.GetAttendanceByMonth(month, year));
        }

        [HttpPost("clockin")]
        [Authorize] // Only Employees clock in/out
        public IActionResult ClockIn()
        {
            var result = _context.ClockIn();
            return Ok(result);
        }

        [HttpPut("clockout")]
        [Authorize] // Only Employees clock in/out
        public IActionResult ClockOut()
        {
            var result = _context.ClockOut();
            return Ok(result);
        }

        [HttpGet("my/status")]
        [Authorize(Roles = "Employee")] // Check own status
        public IActionResult GetMyStatus()
        {
            // returns the Attendance object if open, or null if not clocked in/already clocked out
            var result = _context.GetMyCurrentAttendanceStatus();
            if (result == null)
            {
                // Return OK with a specific status object or just NotFound is also an option
                return Ok(new { isClockedIn = false });
            }
            // Return relevant details, maybe just clock-in time and ID
            return Ok(new { isClockedIn = true, attendanceId = result.AttendanceID, clockInTime = result.ClockInTime });
        }
    }
}
