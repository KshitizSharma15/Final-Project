using System.ComponentModel.DataAnnotations.Schema;

namespace CogniProject.Models
{
    public class Employee
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int EmployeeID {  get; set; }
        public string EmployeeName { get; set; }
        public long EmployeePhoneNumber { get; set; }
        public string EmployeeEmail { get; set; }

        public string Password { get; set; }

        public string Role { get; set; }


        ////Navigation Property
        //public List<Shift> Shifts { get; set; }
        //public List<ShiftReq> ShiftRequests { get; set; }

    }
}
