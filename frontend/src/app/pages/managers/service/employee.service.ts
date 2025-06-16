import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Employee } from '../../../models/Employee';


@Injectable({
  providedIn: 'root',
})
export class EmployeeServiceManager {
  private apiUrl = 'https://localhost:7272/api/Employee';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl)
  }
  getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/id?id=${id}`
    return this.http.get<Employee>(url)
  }
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee)
  }
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    // --- Corrected Line ---
    const url = `${this.apiUrl}/${id}`;
    // --- End of Correction ---
  
    // Add a log to double-check the URL before sending
    console.log('Requesting PUT URL:', url);
  
    // Make the PUT request
    return this.http.put<Employee>(url, employee);
  }
  deleteEmployee(id: number): Observable<void> {
    // Construct the URL for the specific employee ID
    const url = `${this.apiUrl}/${id}`;
    // Make a DELETE request to that URL.
    // Expect no significant content back, hence Observable<void>.
    return this.http.delete<void>(url);
  }
}