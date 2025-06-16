import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LeaveRequest, LeaveStatus } from '../../../models/LeaveReq';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LeaveRequestServiceManager } from '../service/leave-request.service';

@Component({
  selector: 'app-shifts-request-manager',
  standalone: false,
  templateUrl: './leave-request-manager.component.html',
  styleUrl: './leave-request-manager.component.scss'
})
export class LeaveRequestManagerComponent {
  @ViewChild('dt') dt!: Table;

  Leaves!: LeaveRequest[];
  selectedleaves!: LeaveRequest[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;

  constructor(
    private readonly leaveservice: LeaveRequestServiceManager,
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
    this.leaveservice.getAllLeaveRequests().subscribe({
      next: (leaves) => {
        this.Leaves = [];
        this.Leaves.push(...(leaves.filter((leave) => leave.status === 'Pending')));
        this.Leaves.push(...(leaves.filter((leave) => leave.status !== 'Pending')));
        this.loading = false;
      },
      error: () => {
        this.Leaves = [];
        this.loading = false;
      },
    })

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
        this.Leaves = this.Leaves.filter((leave) => leave.leaveId !== id);
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
  approveLeave(id: number) {
    this.leaveservice.approveLeaveRequest(id).subscribe(() => {
      const leave = this.Leaves.find((leave) => leave.leaveId === id);
      if (leave) {
        leave.status = LeaveStatus.Approved;
      }
      this.showToast({severity: 'success', summary:'Success', message: `Shift #${id} approved successfully!`})
    });
  }
  rejectLeave(id: number) {
    this.leaveservice.rejectLeaveRequest(id).subscribe(() => {
      const leave = this.Leaves.find((leave) => leave.leaveId === id);
      if (leave) {
        leave.status = LeaveStatus.Rejected;
      }
      this.showToast({severity: 'success', summary:'Success', message: `Shift #${id} rejected successfully!`})
    });

  }

}
