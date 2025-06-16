import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ShiftReq } from '../../../../models/ShiftReq';
import { ShiftReqServiceEmployee } from '../../service/shift-req.service';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-tabs-requests',
  standalone: false,
  templateUrl: './tabs-requests.component.html',
  styleUrl: './tabs-requests.component.scss'
})
export class TabsRequestsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  shiftRequests!: ShiftReq[];
  selectedshiftRequests!: ShiftReq[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;
  constructor(
    private readonly authService: AuthService,
    private readonly shiftReqService: ShiftReqServiceEmployee,
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
    this.shiftReqService.getShiftsByEmployeeId(this.authService.getUserEmployeeId()!).subscribe((shiftRequests) => {
      this.shiftRequests = shiftRequests;
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