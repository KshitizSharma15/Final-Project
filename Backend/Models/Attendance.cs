using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace CogniProject.Models
{
    public class Attendance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AttendanceID { get; set; }

        [ForeignKey("EmployeeID")]
        [Required(ErrorMessage = "Please enter your employee Id")]
        public int EmployeeID { get; set; }
        public TimeOnly ClockInTime { get; set; }

        public TimeOnly ClockOutTime { get; set; }
        public DateTime Date { get; set; }

        //[JsonIgnore]
        //[AllowNull]
        //public Employee Employee { get; set; }
    }
}
