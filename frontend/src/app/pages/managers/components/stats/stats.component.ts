import { Component } from '@angular/core';
import { Shift } from '../../../../models/Shifts';
import { ShiftServiceManager } from '../../service/shift.service';
import { ShiftReqServiceManager } from '../../service/shift-req.service';
import { ShiftReq } from '../../../../models/ShiftReq';
import { LeaveRequestServiceManager } from '../../service/leave-request.service';
import { LeaveRequest } from '../../../../models/LeaveReq';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  allShifts$!: Shift[];
  allShiftRequests$!: ShiftReq[];
  allLeaveRequests$!: LeaveRequest[];

  activeShifts$!: number;
  pendingShiftRequests$!: number;
  pendingLeaveRequests$!: number;

  isSameDay(closingDate: Date, today: Date) {
    return (
      closingDate.getFullYear() === today.getFullYear() &&
      closingDate.getMonth() === today.getMonth() &&
      closingDate.getDate() === today.getDate()
    );
  }

  constructor(
    private readonly shiftService: ShiftServiceManager,
    private readonly shiftReqService: ShiftReqServiceManager,
    private readonly leaveReqService: LeaveRequestServiceManager,
  ) {}

  statistics: {
    title: string;
    count: string;
    iconBg: string;
    iconClass: string;
    closingLine: string;
    closingBg: string;
    footer: string;
  }[] = [];

  ngOnInit(): void {
    this.shiftService.getAllShifts().subscribe((shifts) => {
      this.activeShifts$ = shifts.filter((shift) =>
        this.isSameDay(new Date(shift.shiftDate), new Date()),
      ).length;
      this.allShifts$ = shifts;
      console.log('all shifts: ', shifts);

      this.statistics.push({
        title: 'Active Shifts',
        count: this.activeShifts$.toString(),
        iconBg: 'bg-green-100',
        iconClass: 'pi pi-calendar-times text-green-500',
        closingLine: ``,
        closingBg: 'text-green-500',
        footer: 'currently active',
      });
    });

    this.shiftReqService.getAllRequests().subscribe((shiftReqs: ShiftReq[]) => {
      this.pendingShiftRequests$ = shiftReqs.filter(
        (shiftReq) => shiftReq.status === 'Pending',
      ).length;
      this.allShiftRequests$ = shiftReqs;
      this.statistics.push({
        title: 'Pending Shift Requests',
        count: this.pendingShiftRequests$.toString(),
        iconBg: 'bg-purple-100',
        iconClass: 'pi pi-hourglass text-purple-500',
        closingLine: `+2`,
        closingBg: 'text-green-500',
        footer: 'since yesterday',
      });
    });

    this.leaveReqService
      .getAllLeaveRequests()
      .subscribe((requests: LeaveRequest[]) => {
        this.pendingLeaveRequests$ = requests.filter(
          (req) => req.status === 'Pending',
        ).length;
        this.allLeaveRequests$ = requests;
        this.statistics.push({
          title: 'Pending Leave Requests',
          count: this.pendingLeaveRequests$.toString(),
          iconBg: 'bg-purple-100',
          iconClass: 'pi pi-clipboard text-purple-500',
          closingLine: ``,
          closingBg: 'text-green-500',
          footer: 'active approval',
        });
      });
  }
}