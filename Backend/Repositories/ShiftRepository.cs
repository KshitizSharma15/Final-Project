using CogniProject.Models;
using CogniProject.Data;
using Microsoft.AspNetCore.Http.HttpResults;  // Import DbContext

namespace CogniProject.Repositories
{
    public class ShiftRepository : IShiftRepository
    {
        private readonly ContextDb _context;

        public ShiftRepository(ContextDb context)
        {
            _context = context;
        }

        public IEnumerable<Shift> GetAllShifts()
        {
            return _context.Shifts.ToList();
        }

        public Shift GetShiftById(int id)
        {
            return _context.Shifts.FirstOrDefault(s => s.ShiftID == id);
        }

        public IEnumerable<Shift> GetShiftByEmpId(int empid)
        {
            return _context.Shifts.Where(s => s.EmployeeID == empid).ToList();
        }

        public int AddShift(Shift shift)
        {
            _context.Shifts.Add(shift);
            return _context.SaveChanges();  // Save changes to DB
        }

        public int UpdateShift(Shift shift)
        {
            var existingShift = GetShiftById(shift.ShiftID);

            existingShift.EmployeeID = shift.EmployeeID;
            existingShift.ShiftDate = shift.ShiftDate;
            existingShift.ShiftTime = shift.ShiftTime;
            return _context.SaveChanges();  // Save changes to DB
        }

        public int DeleteShift(int id)
        {
            var shift = GetShiftById(id);
            _context.Shifts.Remove(shift);
            return _context.SaveChanges();  // Save changes to DB
            
        }
    }
}