using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CogniProject.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    [ApiException]
    public class ShiftReqController : ControllerBase
    {
        private readonly IShiftReqService _shiftReqService;

        public ShiftReqController(IShiftReqService shiftReqService)
        {
            _shiftReqService = shiftReqService;
        }

        [HttpGet]
        //[Authorize(Roles = "Manager")]
        public IActionResult GetAllRequests()
        {
            return Ok(_shiftReqService.GetAllRequests());
        }

        [HttpGet("{id}")]
        //[Authorize(Roles = "Employee,Manager")]
        public IActionResult GetRequestById(int id)
        {
            return Ok(_shiftReqService.GetRequestById(id));
        }

        [HttpGet("employee/{empid}")]
        //[Authorize(Roles = "Employee,Manager")]
        public IActionResult GetRequestByEmpId(int empid)
        {
            return Ok(_shiftReqService.GetRequestByEmpId(empid));
        }

        [HttpPost]
        //[Authorize(Roles = "Manager,Employee")]
        public IActionResult AddRequest([FromBody] ShiftReq request)
        {
            return Ok(_shiftReqService.AddRequest(request));
        }

        [HttpDelete("{id}")]
        //[Authorize(Roles = "Employee")]
        public IActionResult DeleteShiftRequest(int id)
        {
            var result = _shiftReqService.DeleteRequest(id);
            return NoContent();
        }

        [HttpPut("{id}/approve")]
        //[Authorize(Roles = "Manager")]
        public IActionResult ApproveRequest(int id)
        {
            _shiftReqService.ApproveRequest(id, "Approved");
            return Ok("Request approved and Shift Added successfully");
        }

        [HttpPut("{id}/reject")]
        //[Authorize(Roles = "Manager")]
        public IActionResult RejectRequest(int id)
        {
            _shiftReqService.RejectRequest(id, "Rejected");
            return Ok("Request rejected successfully");
        }
    }
}