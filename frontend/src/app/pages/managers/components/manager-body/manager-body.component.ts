import { Component, OnInit } from '@angular/core';
import { ShiftServiceManager } from '../../service/shift.service';
import { EmployeeServiceManager } from '../../service/employee.service';
import { Shift } from '../../../../models/Shifts';
import { Employee } from '../../../../models/Employee';
import { HttpErrorResponse } from '@angular/common/http';
import { AttendanceServiceManager } from '../../service/attendance.service';
import { Attendance } from '../../../../models/Attendance';

@Component({
  selector: 'app-manager-body',
  standalone: false,
  templateUrl: './manager-body.component.html',
  styleUrl: './manager-body.component.scss',
})
export class ManagerBodyComponent implements OnInit {
  constructor(
    private readonly shiftService: ShiftServiceManager,
    private readonly employeeService: EmployeeServiceManager,
    private readonly attendanceService: AttendanceServiceManager,
  ) {}

  employeeWithShifts: {
    name: string;
    time: string;
  } [] = [];

  todayClockInTimes: {
    name: string;
    time: string;
  }[] = [];

  ngOnInit(): void {
    this.shiftService.getAllShifts().subscribe((shifts: Shift[]) => {
      shifts.forEach((shift) => {
        const shiftDate = new Date(shift.shiftDate);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (
          shiftDate.getFullYear() === tomorrow.getFullYear() &&
          shiftDate.getMonth() === tomorrow.getMonth() &&
          shiftDate.getDate() === tomorrow.getDate()
        ) {
          this.employeeService.getEmployeeById(shift.employeeID).subscribe({
            next: (emp: Employee) => {
              this.employeeWithShifts.push({
                name: emp.employeeName,
                time: shift.shiftTime,
              });
            },
            error: (error: HttpErrorResponse) => console.log('erorrr: ', error),
            complete: () => console.log('completed'),
          });
        }
      });
    });

    this.attendanceService
      .getAllAttendances()
      .subscribe((attendances: Attendance[]) => {
        let attendanceCounter = 0;
        attendances.forEach((attendance) => {
          const attendanceDate = new Date(attendance.date);
          const today = new Date();
          if (
            attendanceCounter < 5 &&
            attendanceDate.getFullYear() === today.getFullYear() &&
            attendanceDate.getMonth() === today.getMonth() &&
            attendanceDate.getDate() === today.getDate()
          ) {
            attendanceCounter++;
            this.employeeService
              .getEmployeeById(attendance.employeeID)
              .subscribe({
                next: (emp: Employee) => {
                  this.todayClockInTimes.push({
                    name: emp.employeeName,
                    time: attendance.clockInTime,
                  });
                  console.log(emp);
                },
                error: (error: HttpErrorResponse) =>
                  console.log('erorrr: ', error),
                complete: () => console.log('completed'),
              });
          }
        });
      });
  }
}
