using CogniProject.Models;
using System;
using System.Collections.Generic;

namespace CogniProject.Services
{
    public interface IAttendanceService
    {
        List<Attendance> GetAttendances();
        Attendance GetAttendanceById(int id);
        List<Attendance> GetAttendanceByEmpId(int empId);
        List<Attendance> GetAttendanceByDate(DateTime date);
        List<Attendance> GetAttendanceByMonth(int month, int year);
        int AddAttendance(Attendance attendance);
        Attendance UpdateAttendance(int attendanceId, Attendance attendanceData);
        Attendance ClockIn();
        Attendance ClockOut();
        Attendance GetMyCurrentAttendanceStatus();
    }
}