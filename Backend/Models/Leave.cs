using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CogniProject.Models
{
    public class Leave
    {
        [Key]
        public string LeaveType { get; set; }
        public int TotalLeaves { get; set; }

    }
}
