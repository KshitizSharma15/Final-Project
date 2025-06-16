import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveBalanceService {
  private readonly apiUrl = 'https://localhost:7272/api/LeaveBalances'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // GET: api/LeaveBalances
  getLeaveBalances(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // GET: api/LeaveBalances/{id}
  getLeaveBalance(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // GET: api/LeaveBalances/employee/{employeeId}/type/{leaveType}
  getSpecificBalance(employeeId: number, leaveType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/${employeeId}/type/${leaveType}`);
  }

  // POST: api/LeaveBalances
  postLeaveBalance(leaveBalance: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, leaveBalance);
  }

  // GET: api/LeaveBalances/GetTotalLeaves/{leaveType}
  getTotalLeaves(leaveType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetTotalLeaves/${leaveType}`);
  }
}
