using CogniProject.Models;

namespace CogniProject.Services
{
    public interface ILeaveRequestService
    {

        IEnumerable<LeaveRequest> GetAllLeaveRequest();
        LeaveRequest GetLeaveRequestById(int id);
        IEnumerable<LeaveRequest> GetLeaveRequestByEmpId(int empId);
        int AddLeaveRequest(LeaveRequest Lr);
        int DeleteLeaveRequest(int id);

        string GetRemainingLeaveBalanceByEmpId(int employeeId, string leaveType);

        int ApproveRequest(int LeaveId, string status);
        int RejectRequest(int LeaveId, string status);
    }
}
