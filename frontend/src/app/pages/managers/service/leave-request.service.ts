import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LeaveRequest, LeaveStatus, NewLeaveRequest } from '../../../models/LeaveReq';


@Injectable({
  providedIn: 'root'
})
export class LeaveRequestServiceManager {

  private apiUrl = 'https://localhost:7272/api/LeaveRequests'; // Base URL

  constructor(private http: HttpClient) { }

  // GET /api/LeaveRequests (Manager only)
  getAllLeaveRequests(): Observable<LeaveRequest[]> {
    console.log('Service: Fetching all leave requests...');
    return this.http.get<LeaveRequest[]>(this.apiUrl);
  }

  // GET /api/LeaveRequests/employee/{empid} (Employee/Manager) - CORRECTED URL
  getLeaveRequestsByEmployeeId(employeeId: number): Observable<LeaveRequest[]> {
    const url = `${this.apiUrl}/employee/${employeeId}`; // Correct path
    console.log(`Service: Fetching leave requests for Emp ID ${employeeId} from ${url}`);
    return this.http.get<LeaveRequest[]>(url);
  }

  // GET /api/LeaveRequests/{id} (Employee/Manager, service checks ownership)
  getLeaveRequestById(id: number): Observable<LeaveRequest> {
    const url = `${this.apiUrl}/${id}`;
    console.log(`Service: Fetching leave request by ID ${id} from ${url}`);
    return this.http.get<LeaveRequest>(url);
  }

  // POST /api/LeaveRequests (Employee only role on backend controller)
  // addLeaveRequest(requestData: NewLeaveRequest | any): Observable<LeaveRequest> {
  //   console.log('Service: Adding leave request:', requestData);
  //   return this.http.post<LeaveRequest>(this.apiUrl, requestData);
  // }

  // PUT /api/LeaveRequests/{leaveId}/approve (Manager only)
  approveLeaveRequest(leaveId: number): Observable<string> {
    const url = `${this.apiUrl}/${leaveId}/approve`;
    console.log(`Service: Approving leave request ${leaveId} at ${url}`);
    return this.http.put(url, null, { responseType: 'text' });
  }

  // PUT /api/LeaveRequests/{leaveId}/reject (Manager only)
  rejectLeaveRequest(leaveId: number): Observable<string> {
    const url = `${this.apiUrl}/${leaveId}/reject`;
    console.log(`Service: Rejecting leave request ${leaveId} at ${url}`);
    return this.http.put(url, null, { responseType: 'text' });
  }

  // DELETE /api/LeaveRequests/{id} (Employee only role on backend controller) - ADDED
  // deleteLeaveRequest(id: number): Observable<void> {
  //   const url = `${this.apiUrl}/${id}`;
  //   console.log(`Service: Deleting leave request ${id} at ${url}`);
  //   return this.http.delete<void>(url);
  // }

  // Optional: Get Remaining Balance (Corrected URL)
  getRemainingBalance(employeeId: number, leaveType: string): Observable<string> {
      const url = `${this.apiUrl}/${employeeId}/leaveBalance/${leaveType}`;
      console.log(`Service: Getting balance for Emp ${employeeId}, Type ${leaveType} from ${url}`);
      return this.http.get(url, { responseType: 'text' });
  }
}
