import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Attendance } from '../../../../models/Attendance';
import { AttendanceService } from '../../service/attendance.service';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-tabs-requests',
  standalone: false,
  templateUrl: './tabs-attendance.component.html',
  styleUrl: './tabs-attendance.component.scss'
})
export class TabsAttendanceComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  attendances!: Attendance[];
  selectedattendances!: Attendance[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;
  constructor(
    private readonly authService: AuthService,
    private readonly attendanceService: AttendanceService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

  visible: boolean = false;
  showToast(toast: {severity: string, summary: string, message: string}) {
    this.messageService.add({ severity: toast.severity, summary: toast.summary, detail: toast.message})
  }

  showDialog() {
    this.visible = true;
  }
  ngOnInit(): void {
    this.loading = true;
    this.attendanceService.getAttendanceByEmployeeId(this.authService.getUserEmployeeId()!).subscribe((attendances) => {
      this.attendances = attendances;
      this.loading = false;
    });
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-pencil',
            command: () => {
              this.showDialog();
            },
          },
        ],
      },
    ];
  }
  clear() {
    this.dt.clear();
    this.searchValue = '';
  }
}
