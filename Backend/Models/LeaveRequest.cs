// LeaveRequest.cs
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CogniProject.Models
{
    public class LeaveRequest
    {
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        [EnumDataType(typeof(LeaveStatus))]
        public string? Status { get; set; }
        //    //Navigation Property
        //    public ICollection<LeaveBalance>? LeaveBalance { get; set; }
        //    public Employee? Employee { get; set; }
        //    public Leave? Leave { get; set; }
    }

    public enum LeaveStatus
    {
        pending,
        accepted,
        rejected
    }
}