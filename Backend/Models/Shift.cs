using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CogniProject.Models
{
    public class Shift
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ShiftID { get; set; }
        public int EmployeeID { get; set; }
        public DateTime ShiftDate { get; set; }
        public TimeSpan ShiftTime { get; set; }

        // Navigation Property

        //public Employee Employee { get; set; }
    }
}