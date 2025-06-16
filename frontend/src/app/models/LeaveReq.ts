// src/app/models/leave-request.model.ts

export enum LeaveStatus {
    Approved = "Approved",
    Rejected = "Rejected",
    Pending = "Pending"
}

export interface LeaveRequest {
  leaveId: number;
  employeeId: number;
  leaveType: string;
  startDate: string; // Should be YYYY-MM-DD
  endDate: string;   // Should be YYYY-MM-DD
  status: LeaveStatus;

  // Optional: Include Employee details if API returns them
  // employee?: { employeeName: string; };
}

// Interface for creating new requests
export interface NewLeaveRequest {
  employeeId: number;
  leaveType: string;
  startDate: string; // Expecting YYYY-MM-DD
  endDate: string;   // Expecting YYYY-MM-DD
  status?: string | null; // Add status if needed for backend model binding (set to "" or null)
}