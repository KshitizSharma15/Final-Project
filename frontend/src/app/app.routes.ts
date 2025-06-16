import { Routes } from '@angular/router';
import { AuthGuard } from './core/gaurds/auth/auth.gaurd';
import { AccessComponent } from './pages/auth/access/access.component';
import { ErrorComponent } from './pages/auth/error/error.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { ShiftsComponent } from './pages/employees/shifts/shifts.component';
import { LeaveRequestsComponent } from './pages/employees/leave-requests/leave-requests.component';
import { RequestLeaveComponent } from './pages/employees/request-leave/request-leave.component';
import { AttendanceComponent } from './pages/employees/attendance/attendance.component';
import { ManagersComponent } from './pages/managers/managers.component';
import { EmployeeListComponent } from './pages/managers/employee-list/employee-list.component';
import { AddEmployeeComponent } from './pages/managers/add-employee/add-employee.component';
import { SearchEmployeeComponent } from './pages/managers/search-employee/search-employee.component';
import { ShiftsManagerComponent } from './pages/managers/shifts-manager/shifts-manager.component';
import { ShiftsAddComponent } from './pages/managers/shifts-add/shifts-add.component';
import { ShiftsRequestManagerComponent } from './pages/managers/shifts-request-manager/shifts-request-manager.component';
import { LeaveRequestManagerComponent } from './pages/managers/leave-request-manager/leave-request-manager.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { EmployeeGuard } from './core/gaurds/auth/employee.guard';
import { ManagerGuard } from './core/gaurds/auth/manager.guard';
import { ShiftReqComponent } from './pages/employees/shifts-request/shifts-request.component';
import { EmployeeProfileComponent } from './pages/managers/employee-profile/employee-profile.component';
export const appRoutes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full'},
  { path: 'auth/login', component: LoginComponent},
  {
    path: 'pages',
    canActivate: [
      AuthGuard
    ],
    children: [
      { path: 'employee-profile/:empId', component: EmployeeProfileComponent },
      {
        path: 'employees',
        children: [
          { path: '', component: EmployeesComponent },
          { path: 'shifts', component: ShiftsComponent },
          { path: 'shifts/request', component: ShiftReqComponent },
          { path: 'leave-requests', component: LeaveRequestsComponent },
          { path: 'request-leave', component: RequestLeaveComponent },
          { path: 'attendance', component: AttendanceComponent },
        ],
        canActivate: [
          EmployeeGuard
        ]
      },
      {
        path: 'managers',
        children: [
          { path: '', component: ManagersComponent },
          { path: 'employee-list', component: EmployeeListComponent },
          { path: 'add', component: AddEmployeeComponent },
          { path: 'search', component: SearchEmployeeComponent },
          { path: 'shifts', component: ShiftsManagerComponent },
          { path: 'shifts/add', component: ShiftsAddComponent },
          { path: 'shifts/request', component: ShiftsRequestManagerComponent },
          { path: 'leave-requests', component: LeaveRequestManagerComponent },

        ],
        canActivate: [
          ManagerGuard
        ]
      },
    ],
  },
  {
    path: 'auth',
    children: [
      { path: 'error/:msg', component: ErrorComponent },
      { path: 'access', component: AccessComponent },
    ],
  },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];
