import { Component, OnInit } from '@angular/core';
import { ShiftServiceEmployee } from '../../service/shift.service';
import { EmployeeServiceManager } from '../../../managers/service/employee.service';
import { Shift } from '../../../../models/Shifts';
import { AttendanceService } from '../../service/attendance.service';
import { Attendance } from '../../../../models/Attendance';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-tabs-schedule',
  standalone: false,
  templateUrl: './tabs-schedule.component.html',
  styleUrl: './tabs-schedule.component.scss',
})
export class TabsScheduleComponent implements OnInit {
  constructor(
    private readonly shiftService: ShiftServiceEmployee,
    private readonly employeeService: EmployeeServiceManager,
    private readonly attendanceService: AttendanceService,
    private readonly authService: AuthService,
  ) {}

  allShifts!: Shift[];
  allAttendances!: Attendance[];

  UpcomingShifts: {
    date: string;
    time: string;
  }[] = [];

  PreviousAttendances: {
    date: string;
    checkInTime: string | null;
    checkOutTime: string | null;
  }[] = [];

  ngOnInit(): void {
    const employeeId = this.authService.getUserEmployeeId();
    this.employeeService.getEmployeeById(employeeId!).subscribe((employee) => {
      this.shiftService
        .getShiftsByEmployeeId(employee.employeeID)
        .subscribe((shifts: Shift[]) => {
          this.allShifts = shifts;
          this.loadUpcomingShifts();
        });
    });

    this.attendanceService
      .getMyAttendances()
      .subscribe((attendances: Attendance[]) => {
        this.allAttendances = attendances;
        this.loadPreviousAttendances();
      });

  }

  private loadUpcomingShifts(): void {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    this.allShifts.forEach((shift) => {
      const shiftDate = new Date(shift.shiftDate);
      if (shiftDate >= today && shiftDate <= nextWeek) {
        this.UpcomingShifts.push({
          date: shift.shiftDate,
          time: shift.shiftTime,
        });
      }
    });
  }

  private loadPreviousAttendances(): void {
    this.allAttendances.forEach((attendance) => {
      const attendanceDate = new Date(attendance.date);
      const today = new Date();
      if (attendanceDate < today) {
        this.PreviousAttendances.push({
          date: attendance.date,
          checkInTime: attendance.clockInTime || null,
          checkOutTime: attendance.clockOutTime || null,
        });
      }
    });
  }
}
