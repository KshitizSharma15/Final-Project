import { Component } from '@angular/core';
import { TabsAttendanceComponent } from './components/tabs-attendance/tabs-attendance.component';
import { TabsScheduleComponent } from './components/tabs-schedule/tabs-schedule.component';
import { TabsRequestsComponent } from './components/tabs-requests/tabs-requests.component';

@Component({
  selector: 'app-employees',
  standalone: false,
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
    tabs = [
      { label: 'My Schedule', content: TabsScheduleComponent},
      { label: 'Attendance', content: TabsAttendanceComponent },
      { label: 'Requests', content: TabsRequestsComponent },
    ]
}
