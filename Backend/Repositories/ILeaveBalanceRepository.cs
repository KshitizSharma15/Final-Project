using CogniProject.Models;
using System.Collections.Generic;

namespace CogniProject.Repositories // Or CogniProject.Repository if that's your namespace
{
    public interface ILeaveBalanceRepository
    {
        // Keep basic CRUD if needed elsewhere, ensure names are consistent
        LeaveBalance GetLbById(int balanceId); // Get by Primary Key
        List<LeaveBalance> GetLb(); // Get All
        int AddLb(LeaveBalance Lb);
        int UpdateLb(LeaveBalance Lb);
        int DeleteLb(int balanceId);
        LeaveBalance GetBalanceByEmployeeAndType(int employeeId, string leaveType);
        List<Leave> GetTotalLeaves(string leaveType);
    }
}