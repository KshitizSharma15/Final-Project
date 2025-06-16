import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NewShift, Shift } from '../../../models/Shifts';

@Injectable({
  providedIn: 'root'
})
export class ShiftServiceEmployee {
  private apiUrl = 'https://localhost:7272/api/Shift'; // Base URL for ShiftReqController

  constructor(private http: HttpClient) { }

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
}
