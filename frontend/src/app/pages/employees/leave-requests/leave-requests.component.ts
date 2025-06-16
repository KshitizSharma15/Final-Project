import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveRequestService } from '../service/leave-request.service';
import { NewLeaveRequest } from '../../../models/LeaveReq';
import { AuthService } from '../../auth/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-leave-requests',
  standalone: false,
  templateUrl: './leave-requests.component.html',
  styleUrl: './leave-requests.component.scss'
})
export class LeaveRequestsComponent implements OnInit{
  leaveTypes : string[]=[];
  form!: FormGroup;
  leaveCreated = false;
  loading = false;
  empId! : number;
  minStartDate!: Date;
  minEndDate!: Date;

  constructor(
      private readonly leaveReqService: LeaveRequestService,
      private readonly router: Router,
      private readonly authService: AuthService,
    ) {
      this.minStartDate = new Date();
    this.minEndDate = new Date();
    }
  
    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = '00';
      const minutes = '00';
      const seconds = '00';
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }
  onSubmit(leaveReq: NewLeaveRequest) {
          this.loading = true;
          const selectedLeaveType = this.form.get('leaveType')?.value;
          this.leaveReqService
            .addLeaveRequest({
             employeeId: this.form.get('employeeID')?.value,
             leaveType: selectedLeaveType,
             startDate: this.formatDate(this.form.get('startDate')?.value).split('T')[0],
             endDate: this.formatDate(this.form.get('endDate')?.value).split('T')[0],
           })
           .subscribe({
             next: () => {
               this.leaveCreated = true;
               this.loading = false;
               this.router.navigate(['/pages/employees/']);
             },
             error: (err:HttpErrorResponse) => {
              this.loading = false;
              this.router.navigate(['/auth/error/'+err.error]);
            },
           });
       }
    onCancel() {
    this.router.navigate(['/pages/employees']);
  }
  ngOnInit(): void {
    this.leaveTypes.push('sick');
    this.leaveTypes.push('casual');
    this.empId = this.authService.getUserEmployeeId()!;
    this.form = new FormGroup({
      employeeID: new FormControl(this.empId.toString(), [Validators.required, Validators.min(1)]),
      leaveType: new FormControl<string|null>(null, [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
   });
  }

  get employeeIDErrorMessage() {
    if (this.form.get('employeeID')?.hasError('required')) {
      return 'Employee ID is required';
    }
    if (this.form.get('employeeID')?.hasError('min')) {
      return 'Employee ID must be greater than 0';
    }
    return '';
  }
  get startDateErrorMessage() {
    if (this.form.get('startDate')?.hasError('required')) {
      return 'Start Date is required';
    }
    return '';
  }
  get endDateErrorMessage() {
    if (this.form.get('endDate')?.hasError('required')) {
      return 'End Date is required';
    }
    return '';
  }
  get leaveTypeErrorMessage() {
    if (this.form.get('leaveType')?.hasError('required')) {
      return 'Leave Type is required';
    }
    return '';
  }
}
