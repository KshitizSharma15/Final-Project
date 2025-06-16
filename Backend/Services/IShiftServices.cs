using CogniProject.Models;
using System.Collections.Generic;

namespace CogniProject.Services
{
    public interface IShiftService
    {
        IEnumerable<Shift> GetAllShifts();
        Shift GetShiftById(int id);
        IEnumerable<Shift> GetShiftByEmpId(int empid);
        int AddShift(Shift shift);
        int UpdateShift(Shift shift);
        int DeleteShift(int id);
    }
}