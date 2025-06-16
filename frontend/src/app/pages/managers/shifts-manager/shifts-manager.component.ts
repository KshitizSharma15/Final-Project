import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Shift } from '../../../models/Shifts';
import { ShiftServiceManager } from '../service/shift.service';


@Component({
  selector: 'app-shifts-manager',
  standalone: false,
  templateUrl: './shifts-manager.component.html',
  styleUrl: './shifts-manager.component.scss'
})
export class ShiftsManagerComponent {
  @ViewChild('dt') dt!: Table;

  shifts!: Shift[];
  selectedShifts!: Shift[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;

  constructor(
    private readonly shiftservice: ShiftServiceManager,
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
    this.shiftservice.getAllShifts().subscribe({
      next: (shifts) => {
        this.shifts = shifts;
        this.loading = false;
      },
      error: () => {
        this.shifts = []
        this.loading = false;
      },
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

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.shiftservice.deleteShift(id).subscribe(()=>{
          this.shifts = this.shifts.filter((shift) => shift.shiftID !== id);
          this.showToast({severity: 'success', summary:'Success', message: `Shift #${id} deleted successfully!`})
        })
      },
      reject: () => {},
    });
  }

  clear() {
    if (this.dt) {
      this.dt.clear();
      this.searchValue = '';
    }
  }

}
