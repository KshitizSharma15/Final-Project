using System.Security.Claims;
using CogniProject.Exceptions;
using CogniProject.Models;
using CogniProject.Repositories;
using Microsoft.AspNetCore.Http;
using System;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace CogniProject.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _repo;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;


        public AttendanceService(IAttendanceRepository repo, IEmployeeRepository employeeRepository, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._repo = repo;
            _employeeRepository = employeeRepository;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        //private void CheckIpAddress()
        //{
        //    var allowedIPs = _configuration.GetSection("AllowedClockInIPs").Get<List<string>>() ?? new List<string>();
        //    if (!allowedIPs.Any())
        //    {
        //        // Log warning or allow if no IPs are configured? For now, assume config is intended.
        //        Console.WriteLine("Warning: AllowedClockInIPs not configured in appsettings.json. Denying request.");
        //        throw new UnauthorizedException("Clock In/Out location cannot be verified (Configuration missing).");
        //    }

        //    var remoteIpAddress = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress;

        //    if (remoteIpAddress == null)
        //    {
        //        throw new UnauthorizedException("Could not determine your IP address.");
        //    }
        //    // Handle IPv4 mapped to IPv6 addresses (::ffff:...)
        //    IPAddress ipToCheck = remoteIpAddress;
        //    if (remoteIpAddress.IsIPv4MappedToIPv6)
        //    {
        //        ipToCheck = remoteIpAddress.MapToIPv4();
        //    }
        //    // Check if the user's IP is in the allowed list
        //    if (!allowedIPs.Contains(ipToCheck.ToString()))
        //    {
        //        Console.WriteLine($"Access denied for IP: {ipToCheck}");
        //        throw new UnauthorizedException("Clock In/Out is only allowed from authorized locations.");
        //    }
        //    Console.WriteLine($"Access granted for IP: {ipToCheck}");
        //}

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue("employeeId");
            if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedException("User ID claim not found or invalid in token.");
        }

        private string GetCurrentUserRole()
        {
            var roleClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
            if (string.IsNullOrEmpty(roleClaim))
            {
                throw new UnauthorizedException("User Role claim not found in token.");
            }
            return roleClaim;
        }
        public List<Attendance> GetAttendances()
        {
            return _repo.GetAttendances();
        }
        public Attendance GetAttendanceById(int id)
        {
            var response = _repo.GetAttendanceById(id);
            if (response == null)
            {
                throw new NotFoundException($"Attendance id {id} does not exist.");
            }
            return response;
        }
        public List<Attendance> GetAttendanceByEmpId(int empId)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee" && empId != currentUserId)
            {
                throw new UnauthorizedException("You can only view your own Attendance.");
            }
            var response = _employeeRepository.GetEmployeeById(empId);
            if (response == null)
            {
                throw new NotFoundException($"Employee with {empId} does not exist");
            }
            var Attendance = _repo.GetAttendanceByEmpId(empId);
            if (Attendance == null || !Attendance.Any())
            {
                throw new NotFoundException($"No Attendance found for Employee ID {empId}.");
            }
            return Attendance;
        }
        public List<Attendance> GetAttendanceByDate(DateTime date)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee")
            {
                return _repo.GetAttendanceByDate(date).Where(a => a.EmployeeID == currentUserId).ToList();
            }

            var attendances = _repo.GetAttendanceByDate(date);
            if (attendances == null || attendances.Count == 0)
            {
                throw new NotFoundException($"No attendance records found for {date.ToShortDateString()}. ");
            }
            return attendances;
        }
        public List<Attendance> GetAttendanceByMonth(int month, int year)
        {
            var currentUserId = GetCurrentUserId();
            var currentUserRole = GetCurrentUserRole();

            if (currentUserRole == "Employee")
            {
                return _repo.GetAttendanceByMonth(month, year).Where(a => a.EmployeeID == currentUserId).ToList();
            }

            var attendances = _repo.GetAttendanceByMonth(month, year);
            if (attendances == null || attendances.Count == 0)
            {
                throw new NotFoundException($"No attendance records found for {month}/{year}.");
            }
            return attendances;
        }
        public Attendance UpdateAttendance(int attendanceId, Attendance attendanceData)
        {
            var currentUserRole = GetCurrentUserRole();
            if (currentUserRole != "Manager")
            {
                throw new UnauthorizedAccessException("Only Managers can manually update attendance records.");
            }

            var existingAttendance = _repo.GetAttendanceById(attendanceId);
            if (existingAttendance == null)
            {
                throw new NotFoundException($"Attendance record with ID {attendanceId} not found.");
            }

            if (attendanceData == null) 
            { 
                throw new BadRequestException("Attendance data cannot be null."); 
            }
            if (attendanceData.EmployeeID != 0 && attendanceData.EmployeeID != existingAttendance.EmployeeID) 
            { 
                throw new BadRequestException("Cannot change the Employee ID of an existing record."); 
            }
            if (attendanceData.AttendanceID != 0 && attendanceData.AttendanceID != existingAttendance.AttendanceID) 
            { 
                throw new BadRequestException("Attendance ID mismatch."); 
            }
            if (attendanceData.ClockOutTime != default(TimeOnly) && attendanceData.ClockInTime != default(TimeOnly) && attendanceData.ClockOutTime <= attendanceData.ClockInTime)
            {
                throw new BadRequestException("Clock out time must be after clock in time.");
            }


            existingAttendance.ClockInTime = attendanceData.ClockInTime;
            existingAttendance.ClockOutTime = attendanceData.ClockOutTime;
            existingAttendance.Date = attendanceData.Date;

            // Save changes via repository
            var rowsAffected = _repo.UpdateAttendance(existingAttendance);
            if (rowsAffected <= 0)
            {
                // check if the update happened or not
                throw new Exception("Failed to save attendance update.");
            }
            return existingAttendance;
        }

        public int AddAttendance(Attendance attendance)
        {
            var response = _employeeRepository.GetEmployeeById(attendance.EmployeeID);
            if (response == null)
            {
                throw new NotFoundException($"Employee with {attendance.EmployeeID} does not exist");
            }

            if (_repo.GetAttendances().Any(s => s.EmployeeID == attendance.EmployeeID && s.Date.Date == attendance.Date.Date))
            {
                throw new ConflictException($"Attendance for Employee ID {attendance.EmployeeID} on {attendance.Date.ToShortDateString()} already exists.");
            }
            return _repo.AddAttendance(attendance);
        }
        public Attendance GetMyCurrentAttendanceStatus()
        {
            var currentUserId = GetCurrentUserId();
            var today = DateTime.Today;

            // Find open attendance record for today using the repository method
            var openAttendance = _repo.GetOpenAttendance(currentUserId, today);
            return openAttendance; // Returns null if not clocked in or already clocked out
        }

        public Attendance ClockIn()
        {
            //CheckIpAddress();
            var currentUserId = GetCurrentUserId();
            var now = DateTime.Now;
            var today = now.Date;

            // Check if already clocked in and not clocked out today
            var openAttendance = _repo.GetOpenAttendance(currentUserId, today);
            if (openAttendance != null)
            {
                throw new ConflictException("You have already clocked in today and not clocked out yet.");
            }

            if (_repo.GetAttendanceByDate(today).Any(a => a.EmployeeID == currentUserId && a.ClockOutTime != default(TimeOnly)))
            {
                throw new ConflictException("You have already completed your attendance for today.");
            }

            var newAttendance = new Attendance
            {
                EmployeeID = currentUserId,
                ClockInTime = TimeOnly.ParseExact(TimeOnly.FromDateTime(now).ToString("HH:mm:ss"), "HH:mm:ss"),
                Date = today,
                ClockOutTime = default
            };

            _repo.AddAttendance(newAttendance);
            return newAttendance;
        }

        public Attendance ClockOut()
        {
            var currentUserId = GetCurrentUserId();
            var now = DateTime.Now;
            var today = now.Date;

            var attendanceRecord = _repo.GetOpenAttendance(currentUserId, today);
            if (attendanceRecord == null)
            {
                throw new NotFoundException("Cannot Clock Out: You have not clocked in today or have already clocked out.");
            }

            attendanceRecord.ClockOutTime = TimeOnly.ParseExact(TimeOnly.FromDateTime(now).ToString("HH:mm:ss"), "HH:mm:ss", null);
            _repo.UpdateAttendance(attendanceRecord);
            return attendanceRecord;
        }
    }
}