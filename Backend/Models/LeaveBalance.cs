// LeaveBalance.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CogniProject.Models
{
    public class LeaveBalance
    {
        public int BalanceId { get; set; }
        public int EmployeeId { get; set; }
        public string LeaveType { get; set; }
        public double Balance { get; set; }

        //// Navigation property
        //public Employee? Employee { get; set; }
        //public Leave? Leave { get; set; }
        //public LeaveRequest? LeaveRequest { get; set; }
    }
}