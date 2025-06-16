import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ShiftReq } from '../../../models/ShiftReq';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ShiftReqServiceManager } from '../service/shift-req.service';

@Component({
  selector: 'app-shifts-request-manager',
  standalone: false,
  templateUrl: './shifts-request-manager.component.html',
  styleUrl: './shifts-request-manager.component.scss'
})
export class ShiftsRequestManagerComponent {
  @ViewChild('dt') dt!: Table;

  shifts!: ShiftReq[];
  selectedShifts!: ShiftReq[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;

  constructor(
    private readonly shiftservice: ShiftReqServiceManager,
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
    this.shiftservice.getAllRequests().subscribe({
      next: (shifts) => {
        this.shifts = [];
        this.shifts.push(...(shifts.filter((shift) => shift.status === 'Pending')));
        this.shifts.push(...(shifts.filter((shift) => shift.status !== 'Pending')));
        this.loading = false;
      },
      error: () => {
        this.shifts = [];
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
        // this.shiftservice.deleteShift(id).subscribe()
        this.shifts = this.shifts.filter((shift) => shift.requestID !== id);
        this.showToast({severity: 'success', summary:'Success', message: `Shift #${id} deleted successfully!`})
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
  
  approveShiftRequest(id: number) {
    this.shiftservice.approveRequest(id).subscribe({
      next: () => {
        const shift = this.shifts.find((shift) => shift.requestID === id);
        if (shift) {
          shift.status = "Accepted";
        }
        this.showToast({severity: 'success', summary:'Success', message: `Shift #${id} accepted successfully!`})
      },
      error: (error) => {
        this.showToast({severity: 'error', summary:'Error', message: error.error})
      }
    });
  }

  rejectShiftRequest(id: number) {
    this.shiftservice.rejectRequest(id).subscribe(() => {
      const shift = this.shifts.find((shift) => shift.requestID === id);
      if (shift) {
        shift.status = "Rejected";
      }
      this.shifts = this.shifts.filter((shift) => shift.requestID !== id);
      this.showToast({severity: 'success', summary:'Success', message: `Shift #${id} rejected successfully!`})
    });
  }
}
 