using CogniProject.Models;
using System;
using System.Collections.Generic;

namespace CogniProject.Repositories
{
    public interface IAttendanceRepository
    {
        List<Attendance> GetAttendances();
        Attendance GetAttendanceById(int id);
        List<Attendance> GetAttendanceByEmpId(int empId);
        List<Attendance> GetAttendanceByDate(DateTime date);
        List<Attendance> GetAttendanceByMonth(int month, int year);
        int AddAttendance(Attendance attendance);
        Attendance GetOpenAttendance(int employeeId, DateTime date); // Find record for today where ClockOut is null/default
        int UpdateAttendance(Attendance attendance); // To save ClockOut time

    }
}