import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../service/attendance.service';
import { ButtonModule } from 'primeng/button';
import { AttendanceStatus } from '../../../../models/Attendance';

@Component({
  selector: 'app-header-employee',
  standalone: false,
  styleUrls: ['./header-employee.component.scss'],
  templateUrl: './header-employee.component.html'
})
export class HeaderEmployeeComponent implements OnInit {
  isClockedIn: boolean = false;
  loadingStatus: boolean = false; // To prevent race conditions and UI flickering

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadAttendanceStatus();
  }

  loadAttendanceStatus() {
    this.loadingStatus = true;
    this.attendanceService.getMyCurrentStatus().subscribe({
      next: (status: AttendanceStatus) => {
        this.isClockedIn = status.isClockedIn;
        this.loadingStatus = false;
      },
      error: (error) => {
        console.error('Failed to load attendance status:', error);
        this.loadingStatus = false;
        // Optionally handle the error in the UI (e.g., show a message)
      }
    });
  }

  clockIn() {
    if (!this.isClockedIn && confirm('Are you sure you want to Clock In?')) {
      this.attendanceService.clockIn().subscribe({
        next: () => {
          alert('Clocked In successfully!');
          this.isClockedIn = true;
        },
        error: (error) => {
          console.error('Failed to Clock In:', error);
          alert('Failed to Clock In.');
        }
      });
    }
  }

  clockOut() {
    if (this.isClockedIn && confirm('Are you sure you want to Clock Out?')) {
      this.attendanceService.clockOut().subscribe({
        next: () => {
          alert('Clocked Out successfully!');
          this.isClockedIn = false;
        },
        error: (error) => {
          console.error('Failed to Clock Out:', error);
          alert('Failed to Clock Out.');
        }
      });
    }
  }
}