import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Shift } from '../../../models/Shifts';
import { ShiftServiceEmployee } from '../service/shift.service';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-shifts',
  standalone: false,
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.scss'
})
export class ShiftsComponent implements OnInit{
  @ViewChild('dt') dt!: Table;

  shifts!: Shift[];
  selectedShifts!: Shift[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;
  constructor(
    private readonly authService: AuthService,
    private readonly shiftservice: ShiftServiceEmployee,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService
  ) {}

  visible: boolean = false;

  showToast(toast: {severity: string, summary: string, message: string}){
    this.messageService.add({ severity: toast.severity, summary: toast.summary, detail: toast.message})
  }

  showDialog() {
    this.visible = true;
  }
  ngOnInit() {
    this.loading = true;
    this.shiftservice.getShiftsByEmployeeId(this.authService.getUserEmployeeId()!).subscribe((shifts) => {
      this.shifts = shifts;
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
          {
            label: 'Delete',
            icon: 'pi pi-trash',
            iconStyle: { color: 'red' },
          },
        ],
      },
    ];
  }

  clear() {
    if (this.dt) {
      this.dt.clear();
      this.searchValue = '';
    }
  }

}
