import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NewShiftReq, ShiftReq } from '../../../models/ShiftReq';

 
@Injectable({
  providedIn: 'root'
})
export class ShiftReqServiceManager {

  private apiUrl = 'https://localhost:7272/api/ShiftReq'; // Base URL for ShiftReqController

  constructor(private http: HttpClient) { }

  // GET /api/ShiftReq (Manager only)
  getAllRequests(): Observable<ShiftReq[]> {
    return this.http.get<ShiftReq[]>(this.apiUrl);
    // Interceptor adds authToken
  }

  // GET /api/ShiftReq/{id} (Employee/Manager)
  getRequestById(id: number): Observable<ShiftReq> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ShiftReq>(url);
    // Interceptor adds authToken
  }

  // GET /api/ShiftReq/employee/{empid} (Employee/Manager)
  getShiftsByEmployeeId(employeeId: number): Observable<ShiftReq[]> {
    const url = `${this.apiUrl}/employee/${employeeId}`;
    return this.http.get<ShiftReq[]>(url);
    // AuthInterceptor will add the authToken
  }

  // POST /api/ShiftReq (Employee/Manager)
  addRequest(requestData: NewShiftReq | any): Observable<ShiftReq> { // Allow 'any' temporarily if sending status
    // Assuming backend returns the created request object (incl. ID and "Pending" status)
    return this.http.post<ShiftReq>(this.apiUrl, requestData);
    // Interceptor adds authToken
  }

  // PUT /api/ShiftReq/{id}/approve (Manager only)
  approveRequest(id: number): Observable<string> { // Expecting string message back
    const url = `${this.apiUrl}/${id}/approve`;
    // Send PUT request, expect plain text response
    return this.http.put(url, null, { responseType: 'text' });
    // Interceptor adds authToken
  }

  // PUT /api/ShiftReq/{id}/reject (Manager only)
  rejectRequest(id: number): Observable<string> { // Expecting string message back
    const url = `${this.apiUrl}/${id}/reject`;
    // Send PUT request, expect plain text response
    return this.http.put(url, null, { responseType: 'text' });
    // Interceptor adds authToken
  }

  // --- ADDED: Method to delete shift request ---
  // DELETE /api/ShiftReq/{id} (Employee only for pending)
  deleteShiftRequest(id: number): Observable<void> {
    // Assuming backend returns 200 OK or 204 No Content
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
    // AuthInterceptor will add the authToken
  }
}