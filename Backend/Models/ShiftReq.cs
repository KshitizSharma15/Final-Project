using System.ComponentModel.DataAnnotations.Schema;

namespace CogniProject.Models
{
    public class ShiftReq
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RequestID { get; set; } // Auto-generated primary key
        public int EmployeeID { get; set; } // Entered by Employee
        public DateTime RequestedShiftDate { get; set; } // Entered by Employee
        public TimeSpan RequestedShiftTime { get; set; } // Entered by Employee
        public string Status { get; set; } // Default: "Pending"

        // Navigation Property
        //public Employee Employee { get; set; }
    }
}