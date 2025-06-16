import { Component } from '@angular/core';
import { Shift } from '../../../../models/Shifts';
import { ShiftReq } from '../../../../models/ShiftReq';
import { LeaveRequest } from '../../../../models/LeaveReq';
import { ShiftServiceEmployee } from '../../service/shift.service';
import { ShiftReqServiceEmployee } from '../../service/shift-req.service';
import { LeaveRequestService } from '../../service/leave-request.service';
import { AuthService } from '../../../auth/service/auth.service';
import { LeaveBalanceService } from '../../service/leave-balance.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-stats-employee',
  standalone: false,
  templateUrl: './stats-employee.component.html',
  styleUrl: './stats-employee.component.scss'
})
export class StatsEmployeeComponent {
  allShifts$!: Shift[];
  allShiftRequests$!: ShiftReq[];
  allLeaveRequests$!: LeaveRequest[];

  upcomingShifts$!: number;
  pendingShiftRequests$!: number;
  pendingLeaveRequests$!: number;

  private subscriptions: Subscription[] = []; // To manage subscriptions and prevent memory leaks


  isSameDay(closingDate: Date, today: Date) {
    return (
      closingDate.getFullYear() === today.getFullYear() &&
      closingDate.getMonth() === today.getMonth() &&
      closingDate.getDate() === today.getDate()
    );
  }

  constructor(
    private readonly authService: AuthService,
    private readonly shiftService: ShiftServiceEmployee,
    private readonly shiftReqService: ShiftReqServiceEmployee,
    private readonly leaveReqService: LeaveRequestService,
    private readonly leaveBalanceService: LeaveBalanceService,
  ) {}
  statistics: {
    title: string;
    count: string | number;
    iconBg: string;
    iconClass: string;
    closingLine: string;
    closingBg: string;
    footer: string;
  }[] = [];

  

  ngOnInit(): void {
    const employeeId = this.authService.getUserEmployeeId();
    if (employeeId !== null) {
      this.shiftService.getShiftsByEmployeeId(employeeId).subscribe((shifts) => {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const sevenDaysFromNow = new Date(startOfToday);
        sevenDaysFromNow.setDate(startOfToday.getDate() + 7);

        this.upcomingShifts$ = shifts.filter((shift) => {
          const shiftDate = new Date(shift.shiftDate);
          return shiftDate >= startOfToday && shiftDate < sevenDaysFromNow;
        }).length;
        this.allShifts$ = shifts;
        console.log('all shifts: ', shifts);

        this.statistics.push({
          title: 'Upcoming Shifts',
          count: this.upcomingShifts$.toString(),
          iconBg: 'bg-green-100',
          iconClass: 'pi pi-calendar-times text-green-500',
          closingLine: ``,
          closingBg: 'text-green-500',
          footer: 'in the next 7 days',
        });
      });

      this.shiftReqService.getShiftsByEmployeeId(employeeId).subscribe((shiftRequests) => {
        this.pendingShiftRequests$ = shiftRequests.filter(
          (req) => req.status === 'Pending'
        ).length;
        this.allShiftRequests$ = shiftRequests;

        this.leaveReqService.getLeaveRequestsByEmployeeId(employeeId).subscribe((leaveRequests) => {
          this.pendingLeaveRequests$ = leaveRequests.filter(
        (req) => req.status === 'Pending'
          ).length;
          this.allLeaveRequests$ = leaveRequests;

        const totalPendingRequests = this.pendingShiftRequests$ + this.pendingLeaveRequests$;

        this.statistics.push({
        title: 'Pending Requests',
        count: totalPendingRequests.toString(),
        iconBg: 'bg-purple-100',
        iconClass: 'pi pi-trophy text-purple-500',
        closingLine: ``,
        closingBg: 'text-green-500',
        footer: 'awaiting approval',
          });
        });
      });

      const leaveBalanceSubscription = this.leaveBalanceService.getSpecificBalance(employeeId, 'Annual').subscribe({
        next: (leaveBalance) => {
          const totalLeaveBalance = leaveBalance?.balance !== undefined ? leaveBalance.balance : 0; // Access the correct field

          // Push Leave Balance statistic
          this.statistics.push({
            title: 'Annual Leave Balance',
            count: totalLeaveBalance.toString(),
            iconBg: 'bg-blue-100',
            iconClass: 'pi pi-wallet text-blue-500',
            closingLine: ``,
            closingBg: 'text-blue-500',
            footer: 'Days remaining', 
          });
        },
        error: (error) => {
          console.error('Error fetching annual leave balance:', error);
          // In case of an error, still display 0 leave balance
          this.statistics.push({
            title: 'Annual Leave Balance',
            count: '0',
            iconBg: 'bg-blue-100',
            iconClass: 'pi pi-wallet text-blue-500',
            closingLine: ``,
            closingBg: 'text-blue-500',
            footer: 'Days remaining',
          });
        }
      });
      this.subscriptions.push(leaveBalanceSubscription);
    }    
  };
}
