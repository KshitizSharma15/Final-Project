import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagersComponent } from '../../../pages/managers/managers.component';
import { AddEmployeeComponent } from '../../../pages/managers/add-employee/add-employee.component';
import { SearchEmployeeComponent } from '../../../pages/managers/search-employee/search-employee.component';
import { ShiftsAddComponent } from '../../../pages/managers/shifts-add/shifts-add.component';
import { EmployeeListComponent } from '../../../pages/managers/employee-list/employee-list.component';
import { ShiftsManagerComponent } from '../../../pages/managers/shifts-manager/shifts-manager.component';
import { ShiftsRequestManagerComponent } from '../../../pages/managers/shifts-request-manager/shifts-request-manager.component';
import { LeaveRequestManagerComponent } from '../../../pages/managers/leave-request-manager/leave-request-manager.component';
import { HeaderComponent } from '../../../pages/managers/components/header/header.component';
import { StatsComponent } from '../../../pages/managers/components/stats/stats.component';
import { FluidModule } from 'primeng/fluid';
import { ChartModule } from 'primeng/chart';
import { LayoutModule } from '../../layout/layout.module';
import { OverviewComponent } from '../../../pages/managers/components/overview/overview.component';
import { AnalyticsComponent } from '../../../pages/managers/components/analytics/analytics.component';
import { ReportsComponent } from '../../../pages/managers/components/reports/reports.component';
import { AttendanceOverviewChartComponent } from '../../../pages/managers/components/attendance-overview-chart/attendance-overview-chart.component';
import { ManagerBodyComponent } from '../../../pages/managers/components/manager-body/manager-body.component';
import { ManagerCardsComponent } from '../../../pages/managers/components/manager-cards/manager-cards.component';
import { ShiftServiceManager } from '../../../pages/managers/service/shift.service';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeServiceManager } from '../../../pages/managers/service/employee.service';
import { AttendanceServiceManager } from '../../../pages/managers/service/attendance.service';
import { ShiftReqServiceManager } from '../../../pages/managers/service/shift-req.service';
import { LeaveRequestServiceManager } from '../../../pages/managers/service/leave-request.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Chip } from 'primeng/chip';
import { EmployeeProfileComponent } from '../../../pages/managers/employee-profile/employee-profile.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    ManagersComponent,
    AddEmployeeComponent,
    SearchEmployeeComponent,
    ShiftsAddComponent,
    EmployeeListComponent,
    ShiftsManagerComponent,
    ShiftsRequestManagerComponent,
    LeaveRequestManagerComponent,
    HeaderComponent,
    StatsComponent,
    OverviewComponent,
    AnalyticsComponent,
    ReportsComponent,
    AttendanceOverviewChartComponent,
    ManagerBodyComponent,
    ManagerCardsComponent,
    EmployeeProfileComponent
    
  ],
  imports: [
    CommonModule,
    FluidModule,
    ChartModule,
    LayoutModule,
    AvatarModule,
    TableModule,
    IconField,
    InputIcon,
    FormsModule,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    Dialog,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    PasswordModule,
    SelectButtonModule,
    InputNumberModule,
    DatePicker,
    Chip,
    PaginatorModule
  ],
  providers: [ShiftServiceManager, EmployeeServiceManager, AttendanceServiceManager, ShiftReqServiceManager, LeaveRequestServiceManager,]
})
export class ManagersModule { }
