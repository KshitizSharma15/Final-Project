import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Added switchMap, throwError
import { Attendance, AttendanceStatus } from '../../../models/Attendance';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private apiUrl = 'https://localhost:7272/api/Attendances'; // Base URL for AttendancesController

  constructor(private http: HttpClient, private authService: AuthService) { }
  
  // POST /api/Attendances/clockin
  clockIn(): Observable<Attendance> {
    const url = `${this.apiUrl}/clockin`;
    return this.http.post<Attendance>(url, {});
  }

  // PUT /api/Attendances/clockout
  clockOut(): Observable<Attendance> {
    const url = `${this.apiUrl}/clockout`;
    return this.http.put<Attendance>(url, {}); // Empty body
  }

  getAttendanceById(id: number): Observable<Attendance> {
    const url = `${this.apiUrl}/${id}`;
    // AuthInterceptor adds authToken
    return this.http.get<Attendance>(url);
  }

  // GET /api/Attendances/my/status
  getMyCurrentStatus(): Observable<AttendanceStatus> {
     const url = `${this.apiUrl}/my/status`;
     return this.http.get<AttendanceStatus>(url);
  }

  // GET /api/Attendances/employee/{empId} (For Manager viewing specific employee)
  getAttendanceByEmployeeId(employeeId: number): Observable<Attendance[]> {
    const url = `${this.apiUrl}/employee/${employeeId}`;
      return this.http.get<Attendance[]>(url);
  }
  // Uses the auth service to get the ID first
  getMyAttendances(): Observable<Attendance[]> {
      const employeeId = this.authService.getUserEmployeeId();
      if (employeeId === null) {
          console.error("getMyAttendances: Employee ID not found in authToken.");
          return throwError(() => new Error("Cannot get own attendance: Employee ID not found."));
      }
      // Call the specific endpoint using the retrieved ID
      return this.getAttendanceByEmployeeId(employeeId);
  }
}
