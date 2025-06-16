import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Employee } from '../../../models/Employee';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { EmployeeServiceManager } from '../service/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  @ViewChild('dt') dt!: Table;

  employees!: Employee[];
  selectedEmployees!: Employee[];
  loading: boolean = true;
  searchValue: string = '';
  items: MenuItem[] | undefined;

  constructor(
    private readonly employeeService: EmployeeServiceManager,
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
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: () => {
        this.employees = [];
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
        this.employeeService.deleteEmployee(id).subscribe(()=>{
          this.employees = this.employees.filter((emp) => emp.employeeID !== id);
          this.showToast({severity: 'success', summary:'Success', message: `Employee #${id} deleted successfully!`})
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
