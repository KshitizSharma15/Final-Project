import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NewShiftReq, ShiftReq } from '../../../models/ShiftReq';
@Injectable({
  providedIn: 'root'
})
export class ShiftReqServiceEmployee {
  private apiUrl = 'https://localhost:7272/api/ShiftReq';

  constructor(private http: HttpClient) { }

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

  addRequest(requestData: NewShiftReq ): Observable<ShiftReq> { // Allow 'any' temporarily if sending status
    // Assuming backend returns the created request object (incl. ID and "Pending" status)
    return this.http.post<ShiftReq>(this.apiUrl, requestData);
    // Interceptor adds authToken
  }
}
