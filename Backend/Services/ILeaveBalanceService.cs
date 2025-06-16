using CogniProject.Models;
using System.Collections.Generic;

namespace CogniProject.Services
{
    public interface ILeaveBalanceService
    {
        List<LeaveBalance> GetLb();
        LeaveBalance GetLb(int balanceId); 
        int AddLb(LeaveBalance Lb); // For initial setup

        // --- Core Methods for Leave Request Workflow ---
        LeaveBalance GetSpecificLeaveBalance(int employeeId, string leaveType);
        bool DeductLeaveBalance(int employeeId, string leaveType, double durationToDeduct);
        // Keep if needed, calls repo
        List<Leave> GetTotalLeaves(string leaveType);
    }
}