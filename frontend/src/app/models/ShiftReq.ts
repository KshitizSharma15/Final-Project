export interface ShiftReq {
    requestID: number; // Matches C# RequestID
    employeeID: number; // Matches C# EmployeeID
    requestedShiftDate: string; // Matches C# RequestedShiftDate (represent as ISO string)
    requestedShiftTime: string; // Matches C# RequestedShiftTime (represent as HH:mm:ss string)
    status: string; // Matches C# Status ("Pending", "Approved", "Rejected")
}

export interface NewShiftReq {
    employeeID: number;
    requestedShiftDate: string; // Expecting YYYY-MM-DD format from date input
    requestedShiftTime: string; // Expecting HH:mm format from time input
    status: string;
}
