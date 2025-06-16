export interface Attendance {
    attendanceID: number;
    employeeID: number;
    clockInTime: string;
    clockOutTime: string | null;
    date: string;
  }
  
  export interface AttendanceStatus {
      isClockedIn: boolean;
      attendanceId?: number;
      clockInTime?: string; // TimeOnly as string
  }