import { Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { EmployeeServiceManager } from '../service/employee.service'; 
import { Employee } from '../../../models/Employee';
import { ActivatedRoute } from '@angular/router';
import { ShiftServiceManager } from '../service/shift.service';
import { Shift } from '../../../models/Shifts';

@Component({
  selector: 'app-employee-profile',
  standalone: false,
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss'
})
export class EmployeeProfileComponent implements OnInit {
  empId!: number;
  employee!: Employee;
  shifts!: Shift[];

  constructor(private employeeService: EmployeeServiceManager, private activatedRoute: ActivatedRoute, private shiftService: ShiftServiceManager) {}

  ngOnInit(): void {
    this.empId = +this.activatedRoute.snapshot.params['empId'];
    this.getEmployeeDetails()
    this.getEmployeeShifts();
    console.table(this.employee);
  }

  getEmployeeDetails(): void {
    this.employeeService.getEmployeeById(this.empId).subscribe(
      {
        next: (employee) => {
          this.employee = employee;
        },
        error: (error) => {
          console.error('Error fetching employee details:', error);
        }
      }
    );
  }

  getEmployeeShifts(): void {
    this.shiftService.getShiftsByEmployeeId(this.empId).subscribe(
      {
        next: (shifts:Shift[]) => {
          this.shifts = shifts;
        },
        error: (error) => {
          console.error('Error fetching shift details:', error);
        }
      }
    );
  }
}