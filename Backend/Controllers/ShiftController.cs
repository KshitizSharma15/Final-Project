using Microsoft.AspNetCore.Mvc;
using CogniProject.Models;
using CogniProject.Services;
using CogniProject.Exceptions;
using Microsoft.AspNetCore.Authorization;

namespace CogniProject.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [ApiException]
    public class ShiftController : ControllerBase
    {
        private readonly IShiftService _shiftService;

        public ShiftController(IShiftService shiftService)
        {
            _shiftService = shiftService;
        }

        [HttpGet]
        //[Authorize(Roles = "Manager")]
        public IActionResult GetAllShifts()
        {
            return Ok(_shiftService.GetAllShifts());
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "Employee,Manager")]
        public IActionResult GetShiftById(int id)
        {
            return Ok(_shiftService.GetShiftById(id));
        }

        [HttpGet("employee/{empid}")]
        //[Authorize(Roles = "Employee,Manager")]
        public IActionResult GetShiftByEmpId(int empid)
        {
            return Ok(_shiftService.GetShiftByEmpId(empid));
        }

        [HttpPost]
        //[Authorize(Roles = "Manager")]
        public IActionResult AddShift([FromBody] Shift shift)
        {
            return Ok(_shiftService.AddShift(shift));
        }

        [HttpPut("{id}")]
        //[Authorize(Roles = "Manager")]
        public IActionResult UpdateShift(int id, [FromBody] Shift shift)
        {
            return Ok(_shiftService.UpdateShift(shift));
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Manager")]
        public IActionResult DeleteShift(int id)
        {
            return Ok(_shiftService.DeleteShift(id));
        }
    }
}