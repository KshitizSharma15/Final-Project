using CogniProject.Models;
namespace CogniProject.Repositories
{
    public interface ILeaveRequestRepository
    {
        IEnumerable<LeaveRequest> GetAllLeaveRequest(); 
        LeaveRequest GetLeaveRequestById(int id);
        IEnumerable<LeaveRequest> GetLeaveRequestByEmpId(int empId);
        int AddLeaveRequest(LeaveRequest Lr);
        int DeleteLeaveRequest(int id);
        int UpdateLeaveStatus(int LeaveId, string status);
        string GetRemainingLeaveBalanceByEmpId(int employeeId, string leaveType);
    }
}
