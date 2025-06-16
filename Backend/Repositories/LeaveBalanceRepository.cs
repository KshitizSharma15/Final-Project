using CogniProject.Data;
using CogniProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace CogniProject.Repositories
{
    public class LeaveBalanceRepository : ILeaveBalanceRepository
    {
        private readonly ContextDb db;

        public LeaveBalanceRepository(ContextDb db)
        {
            this.db = db;
        }
        public LeaveBalance GetLbById(int balanceId) // Renamed for clarity
        {
            return db.LeaveBalance.FirstOrDefault(x => x.BalanceId == balanceId);
        }
        public List<LeaveBalance> GetLb()
        {
            return db.LeaveBalance.ToList();
        }

        public int AddLb(LeaveBalance Lb)
        {
            db.LeaveBalance.Add(Lb);
            return db.SaveChanges();
        }

        public int UpdateLb(LeaveBalance Lb)
        {
            // Check if entity is already tracked, if not, attach it
            var local = db.Set<LeaveBalance>()
                .Local
                .FirstOrDefault(entry => entry.BalanceId.Equals(Lb.BalanceId));

            if (local != null)
            {
                // Detach the local copy if already tracked
                db.Entry(local).State = EntityState.Detached;
            }
            // Set the state of the passed-in entity to Modified
            db.Entry(Lb).State = EntityState.Modified;

            return db.SaveChanges();
        }
        public int DeleteLb(int balanceId)
        {
            LeaveBalance b = GetLbById(balanceId);
            if (b != null)
            {
                db.LeaveBalance.Remove(b);
                return db.SaveChanges();
            }
            return 0;
        }
        public LeaveBalance GetBalanceByEmployeeAndType(int employeeId, string leaveType)
        {
            return db.LeaveBalance.FirstOrDefault(lb => lb.EmployeeId == employeeId && lb.LeaveType == leaveType);
        }
        public List<Leave> GetTotalLeaves(string leaveType)
        {
            return db.TotalLeave.Where(l => l.LeaveType == leaveType).ToList();
        }
    }
}
