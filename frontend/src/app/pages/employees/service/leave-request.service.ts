import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LeaveRequest, LeaveStatus, NewLeaveRequest } from '../../../models/LeaveReq';


@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private apiUrl = 'https://localhost:7272/api/LeaveRequests'; // Base URL

  constructor(private http: HttpClient) { }

  // GET /api/LeaveRequests/employee/{empid} (Employee/Manager) - CORRECTED URL
  getLeaveRequestsByEmployeeId(employeeId: number): Observable<LeaveRequest[]> {
    const url = `${this.apiUrl}/employee/${employeeId}`; // Correct path
    console.log(`Service: Fetching leave requests for Emp ID ${employeeId} from ${url}`);
    return this.http.get<LeaveRequest[]>(url);
  }
  // GET /api/LeaveRequests/{id} (Employee/Manager, service checks ownership)
  getLeaveRequestById(id: number): Observable<LeaveRequest> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<LeaveRequest>(url);
  }

  addLeaveRequest(requestData: NewLeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.apiUrl, requestData);
  }

  deleteLeaveRequest(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
