using CogniProject.Data;
using CogniProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CogniProject.Repositories
{
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly ContextDb db;

        public AttendanceRepository(ContextDb db)
        {
            this.db = db;
        }
        // --- Existing Methods (Keep As Is) ---
        public List<Attendance> GetAttendances() { return db.Attendances.ToList(); }
        public Attendance GetAttendanceById(int id) { return db.Attendances.FirstOrDefault(a => a.AttendanceID == id); }
        public List<Attendance> GetAttendanceByEmpId(int empId) { return db.Attendances.Where(a => a.EmployeeID == empId).ToList(); }
        public List<Attendance> GetAttendanceByDate(DateTime date) { return db.Attendances.Where(a => a.Date.Date == date.Date).ToList(); }
        public List<Attendance> GetAttendanceByMonth(int month, int year) { return db.Attendances.Where(a => a.Date.Year == year && a.Date.Month == month).ToList(); }
        public int AddAttendance(Attendance attendance)
        {
            db.Attendances.Add(attendance);
            return db.SaveChanges();
        }
        public Attendance GetOpenAttendance(int employeeId, DateTime date)
        {
            return db.Attendances.FirstOrDefault(a => a.EmployeeID == employeeId &&
                                             a.Date.Date == date.Date &&
                                             a.ClockOutTime == default(TimeOnly));
        }
        public int UpdateAttendance(Attendance attendance)
        {
            db.Entry(attendance).State = EntityState.Modified;
            return db.SaveChanges();
        }
    }
}