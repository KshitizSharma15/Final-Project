import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AttendanceService } from '../service/attendance.service';
import { Attendance } from '../../../models/Attendance';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-attendance',
  standalone: false,
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit {
  empID!: number;
  data: any;
  options: any;
  attendanceData!: Attendance[];

  constructor(
    private cd: ChangeDetectorRef,
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {    
    this.empID = this.authService.getUserEmployeeId()!;
    this.attendanceService.getAttendanceByEmployeeId(this.empID).subscribe({
      next: (data) => {
        this.attendanceData = data;
        console.log(this.attendanceData);
        this.initChart();
      },
      error: (error) => {
        console.error('Error fetching attendance data:', error);
      },
    });
  }
  
  getMonth(date: string): string {
    const month = new Date(date).toLocaleString('default', { month: 'long' });
    return month;
  }

  initChart() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
    const attendanceByMonth = new Map<string, number>()
    this.attendanceData.forEach((attendance) => {
      const month = this.getMonth(attendance.date);
      attendanceByMonth.set(month, (attendanceByMonth.get(month) || 0) + 1);
    });
    const currentMonth = new Date().getMonth();
    const monthsToShow = months.slice((currentMonth - 6 + 12) % 12, currentMonth).concat(
      months.slice(0, (currentMonth - 6 + 12) % 12 > currentMonth ? currentMonth : 0)
    );
    const dataset1: number[] = []
    monthsToShow.forEach((month) => {
    dataset1.push(attendanceByMonth.get(month)!)})
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color'
    );

    this.data = {
      labels: monthsToShow,
      datasets: [
        // {
        //   type: 'line',
        //   label: 'Dataset 1',
        //   borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        //   borderWidth: 2,
        //   fill: false,
        //   tension: 0.4,
        //   data: [50, 25, 12, 48, 56, 76, 42],
        // },
        {
          type: 'bar',
          label: 'Attendance',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: dataset1,
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
    this.cd.markForCheck();
  }
}
