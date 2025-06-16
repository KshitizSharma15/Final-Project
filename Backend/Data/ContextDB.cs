using CogniProject.Models;
using Microsoft.EntityFrameworkCore;

namespace CogniProject.Data
{
    public class ContextDb : DbContext
    {
        public ContextDb(DbContextOptions<ContextDb> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<ShiftReq> ShiftReqs { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<LeaveRequest> LeaveRequest { get; set; }
        public DbSet<LeaveBalance> LeaveBalance { get; set; }
        public DbSet<Leave> TotalLeave { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Employee Entity Configuration
            modelBuilder.Entity<Employee>()
                .HasKey(e => e.EmployeeID);

            //modelBuilder.Entity<Employee>()
            //    .Property(e => e.EmployeeName)
            //    .HasMaxLength(100);

            //modelBuilder.Entity<Employee>()
            //    .Property(e => e.EmployeeEmail)
            //    .HasMaxLength(100);

            //modelBuilder.Entity<Employee>()
            //    .Property(e => e.Password)
            //    .HasMaxLength(256);

            //modelBuilder.Entity<Employee>()
            //    .Property(e => e.Role)
            //    .HasMaxLength(20);

            // Shift Entity Configuration
            modelBuilder.Entity<Shift>()
                .HasKey(s => s.ShiftID);

            //modelBuilder.Entity<Shift>()
            //    .HasOne(s => s.Employee)
            //    .WithMany(e => e.Shifts)
            //    .HasForeignKey(s => s.EmployeeID)
            //    .OnDelete(DeleteBehavior.Cascade); // Delete Shifts when Employee is deleted

            // ShiftRequest Entity Configuration
            modelBuilder.Entity<ShiftReq>()
                .HasKey(sr => sr.RequestID);

            //modelBuilder.Entity<ShiftReq>()
            //    .HasOne(sr => sr.Employee)
            //    .WithMany(e => e.ShiftRequests)
            //    .HasForeignKey(sr => sr.EmployeeID)
            //    .OnDelete(DeleteBehavior.Cascade); // Delete ShiftRequests when Employee is deleted

            //modelBuilder.Entity<ShiftReq>()
            //    .Property(sr => sr.Status)
            //    .HasMaxLength(20);

            // Leave Entity Configuration (TotalLeave)
            modelBuilder.Entity<Leave>()
                .HasKey(l => l.LeaveType);

            //modelBuilder.Entity<Leave>()
            //    .Property(l => l.LeaveType)
            //    .HasMaxLength(50); // Suggesting a max length for LeaveType

            // LeaveRequest Entity Configuration
            modelBuilder.Entity<LeaveRequest>()
                .HasKey(lr => lr.LeaveId);

            //modelBuilder.Entity<LeaveRequest>()
            //    .Property(lr => lr.Status)
            //    .HasMaxLength(20);

            //modelBuilder.Entity<LeaveRequest>()
            //    .HasOne(lr => lr.Employee)
            //    .WithMany() // Assuming one Employee can have many leave requests
            //    .HasForeignKey(lr => lr.EmployeeId)
            //    .OnDelete(DeleteBehavior.Cascade); // Consider appropriate delete behavior

            //modelBuilder.Entity<LeaveRequest>()
            //    .HasOne(lr => lr.Leave)
            //    .WithMany() // Assuming one LeaveType can have many leave requests
            //    .HasForeignKey(lr => lr.LeaveType)
            //    .OnDelete(DeleteBehavior.Restrict); // Prevent deleting LeaveType if there are associated LeaveRequests

            // LeaveBalance Entity Configuration
            modelBuilder.Entity<LeaveBalance>()
                .HasKey(lb => lb.BalanceId);

            //modelBuilder.Entity<LeaveBalance>()
            //    .Property(lb => lb.Balance)
            //    .HasColumnType("decimal(5,2)");

            //modelBuilder.Entity<LeaveBalance>()
            //    .HasOne(lb => lb.Employee)
            //    .WithMany() // Assuming one Employee can have many leave balances
            //    .HasForeignKey(lb => lb.EmployeeId)
            //    .OnDelete(DeleteBehavior.Cascade); // Consider appropriate delete behavior

            //modelBuilder.Entity<LeaveBalance>()
            //    .HasOne(lb => lb.Leave)
            //    .WithMany() // Assuming one LeaveType can have many leave balances
            //    .HasForeignKey(lb => lb.LeaveType)
            //    .OnDelete(DeleteBehavior.Restrict); // Prevent deleting LeaveType if there are associated LeaveBalances
        }
    }
}