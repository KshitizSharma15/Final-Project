import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ShiftReqServiceEmployee } from '../service/shift-req.service';
import { NewShiftReq } from '../../../models/ShiftReq';
import { AuthService } from '../../auth/service/auth.service';
import { Shift } from '../../../models/Shifts';
import { ShiftServiceManager } from '../../managers/service/shift.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shifts-add',
  standalone: false,
  templateUrl: './shifts-request.component.html',
  styleUrl: './shifts-request.component.scss',
})
export class ShiftReqComponent {
  form!: FormGroup;
  shiftCreated = false;
  loading = false;
  empId! : number;
  shifts! : Shift[];
  minDate!: Date;

  constructor(
    private readonly shiftReqService: ShiftReqServiceEmployee,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly shiftService: ShiftServiceManager,
  ) {
    this.minDate = new Date();
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

  formatTime(dateString: string): string {
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:00`;
  }

  onSubmit(shiftReq: NewShiftReq) {


    this.loading = true;
    this.shiftReqService
      .addRequest({
        employeeID: this.form.get('employeeID')?.value,
        requestedShiftDate: this.formatDate(this.form.get('shiftDate')?.value),
        requestedShiftTime: this.formatTime(this.form.get('shiftTime')?.value),
        status: 'Pending',
      })
      .subscribe({
        next: () => {
          this.shiftCreated = true;
          this.loading = false;
          this.router.navigate(['/pages/employees']);
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
    this.empId = this.authService.getUserEmployeeId()!;
    this.form = new FormGroup({
      employeeID: new FormControl(this.empId.toString(), [Validators.required, Validators.min(1)]),
      shiftDate: new FormControl('', [Validators.required]), /////////////////////////////////////////////////
      shiftTime: new FormControl('', [Validators.required]),
    });
    this.shiftService.getShiftsByEmployeeId(this.empId).subscribe((shifts) => {
      this.shifts = shifts;
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

  get shiftDateErrorMessage() {
    if (this.form.get('shiftDate')?.hasError('required')) {
      return 'Shift date is required';
    }
    return '';
  }

  get shiftTimeErrorMessage() {
    if (this.form.get('shiftTime')?.hasError('required')) {
      return 'Shift time is required';
    }
    return '';
  }
}
