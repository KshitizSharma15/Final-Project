using CogniProject.Data;
using CogniProject.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace CogniProject.Repositories
{
    public class LeaveRequestRepository : ILeaveRequestRepository
    {
        private readonly ContextDb db;

        public LeaveRequestRepository(ContextDb db)
        {
            this.db = db;
        }
        public IEnumerable<LeaveRequest> GetAllLeaveRequest()
        {
            return db.LeaveRequest.ToList();
        }
        public LeaveRequest GetLeaveRequestById(int id)
        {
            return db.LeaveRequest.Where(x => x.LeaveId == id).FirstOrDefault();
        }
        public IEnumerable<LeaveRequest> GetLeaveRequestByEmpId(int empID)
        {
            return db.LeaveRequest.Where(s => s.EmployeeId == empID).ToList();

        }
        public int AddLeaveRequest(LeaveRequest Lr)
        {
            Lr.Status = "Pending";
            db.LeaveRequest.Add(Lr);
            return db.SaveChanges();
        }
        public int DeleteLeaveRequest(int id)
        {
            LeaveRequest r = db.LeaveRequest.Where(x => x.LeaveId == id).FirstOrDefault();
            db.LeaveRequest.Remove(r);
            return db.SaveChanges();
        }
        public int UpdateLeaveStatus(int LeaveId, string status)
        {
            var response = db.LeaveRequest.FirstOrDefault(req => req.LeaveId == LeaveId);
            response.Status = status;
            return db.SaveChanges();
        }
        public string GetRemainingLeaveBalanceByEmpId(int employeeId, string leaveType)
        {
            var leaveBalance = db.LeaveBalance.FirstOrDefault(lb => lb.EmployeeId == employeeId && lb.LeaveType == leaveType);

            if (leaveBalance == null)
            {
                return "Leave balance not found.";
            }
            return $"You have {leaveBalance.Balance} {leaveType} leaves remaining.";
        }
    }

}

