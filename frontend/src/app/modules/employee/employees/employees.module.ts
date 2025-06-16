import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from '../../../pages/employees/employees.component';
import { ShiftsComponent } from '../../../pages/employees/shifts/shifts.component';
import { LeaveRequestsComponent } from '../../../pages/employees/leave-requests/leave-requests.component';
import { RequestLeaveComponent } from '../../../pages/employees/request-leave/request-leave.component';
import { LeaveBalanceComponent } from '../../../pages/employees/leave-balance/leave-balance.component';
import { AttendanceComponent } from '../../../pages/employees/attendance/attendance.component';
import { HeaderEmployeeComponent } from '../../../pages/employees/components/header-employee/header-employee.component';
import { StatsEmployeeComponent } from '../../../pages/employees/components/stats-employee/stats-employee.component';
import { TabsEmployeeComponent } from '../../../pages/employees/components/tabs-employee/tabs-employee.component';
import { TabsScheduleComponent } from '../../../pages/employees/components/tabs-schedule/tabs-schedule.component';
import { TabsAttendanceComponent } from '../../../pages/employees/components/tabs-attendance/tabs-attendance.component';
import { TabsRequestsComponent } from '../../../pages/employees/components/tabs-requests/tabs-requests.component';
import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { LayoutModule } from '../../layout/layout.module';
import { ScheduleCardsComponent } from '../../../pages/employees/components/schedule-cards/schedule-cards.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconField} from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Dialog, DialogModule } from 'primeng/dialog';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ShiftReqComponent } from '../../../pages/employees/shifts-request/shifts-request.component';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { SelectModule } from 'primeng/select';
import { Chip } from 'primeng/chip';
import { InputNumberModule } from 'primeng/inputnumber';
import { AttendanceService } from '../../../pages/employees/service/attendance.service';
import { LeaveRequestService } from '../../../pages/employees/service/leave-request.service';
import { ShiftServiceEmployee } from '../../../pages/employees/service/shift.service';
import { ShiftReqServiceEmployee } from '../../../pages/employees/service/shift-req.service';
import { LeaveBalanceService } from '../../../pages/employees/service/leave-balance.service';



@NgModule({
  declarations: [
    EmployeesComponent,
    ShiftsComponent,
    LeaveRequestsComponent,
    RequestLeaveComponent,
    LeaveBalanceComponent,
    AttendanceComponent,
    HeaderEmployeeComponent,
    StatsEmployeeComponent,
    TabsEmployeeComponent,
    TabsScheduleComponent,
    TabsAttendanceComponent,
    TabsRequestsComponent,
    ScheduleCardsComponent,
    ShiftReqComponent,
    LeaveRequestsComponent
  ],
  imports: [
    CommonModule,
    FluidModule,
    ChartModule,
    LayoutModule,
    TableModule,
    FormsModule,
    ButtonModule,
    IconField,
    InputIcon,
    DialogModule,
    RouterModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    DatePickerModule,
    InputTextModule,
    AvatarModule,
    ConfirmDialogModule,
    Dialog,
    SelectModule,
    DatePicker,
    InputNumberModule,
    Chip,
    ButtonModule
  ],
  providers:[AttendanceService, LeaveRequestService, ShiftServiceEmployee, ShiftReqServiceEmployee, LeaveBalanceService]
})
export class EmployeesModule { }
