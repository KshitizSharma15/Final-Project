using CogniProject.Models;

namespace CogniProject.Repositories
{
    public interface IShiftRepository
    {
        IEnumerable<Shift> GetAllShifts();
        Shift GetShiftById(int id);
        IEnumerable<Shift> GetShiftByEmpId(int empid);
        int AddShift(Shift shift);
        int UpdateShift(Shift shift);
        int DeleteShift(int id);
    }
}
