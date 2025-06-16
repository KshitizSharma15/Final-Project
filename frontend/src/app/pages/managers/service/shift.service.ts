import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NewShift, Shift } from '../../../models/Shifts';


@Injectable({
  providedIn: 'root'
})
export class ShiftServiceManager {

  private apiUrl = 'https://localhost:7272/api/Shift'; // Base URL for ShiftReqController

  constructor(private http: HttpClient) { }
 
  // GET /api/Shift (Manager only)
  getAllShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl);
    // AuthInterceptor will add the authToken
  }
 
  // GET /api/Shift/{id} (Employee/Manager)
  getShiftById(id: number): Observable<Shift> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Shift>(url);
    // AuthInterceptor will add the authToken
  }
 
  // GET /api/Shift/employee/{empid} (Employee/Manager)
  getShiftsByEmployeeId(employeeId: number): Observable<Shift[]> {
    const url = `${this.apiUrl}/employee/${employeeId}`;
    return this.http.get<Shift[]>(url);
  }
 
  // POST /api/Shift (Manager only)
  addShift(shiftData: NewShift): Observable<Shift> {
    // Assuming backend returns the created shift object
    return this.http.post<Shift>(this.apiUrl, shiftData);
    // AuthInterceptor will add the authToken
  }
 
  // PUT /api/Shift/{id} (Manager only)
  updateShift(id: number, shiftData: Shift): Observable<Shift> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Shift>(url, shiftData);
  }
 
  // DELETE /api/Shift/{id} (Manager only)
  deleteShift(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
