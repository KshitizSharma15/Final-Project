import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/service/auth.service';
import { Router } from '@angular/router';
import { Employee } from '../../../models/Employee';
import { NewShift, Shift } from '../../../models/Shifts';
import { ShiftServiceManager } from '../service/shift.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shifts-add',
  standalone: false,
  templateUrl: './shifts-add.component.html',
  styleUrl: './shifts-add.component.scss',
})
export class ShiftsAddComponent {
  form!: FormGroup;
  shiftCreated = false;
  loading = false;
  allShifts!: Shift[];
  shifts! : Shift[];
  minDate!: Date;

  constructor(
    private readonly shiftService: ShiftServiceManager,
    private readonly router: Router,
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

  onSubmit(shift: NewShift) {

    this.loading = true;
    this.shiftService
      .addShift({
        employeeID: this.form.get('employeeID')?.value,
        shiftDate: this.formatDate(this.form.get('shiftDate')?.value),
        shiftTime: this.formatTime(this.form.get('shiftTime')?.value),
      })
      .subscribe({
        next: () => {
          this.shiftCreated = true;
          this.loading = false;
          this.router.navigate(['/pages/managers/shifts']);
        },
        error: (err:HttpErrorResponse) => {
          this.loading = false;
          this.router.navigate(['/auth/error/'+err.error]);
        },
      });
  }

  onCancel() {
    this.router.navigate(['/pages/admin']);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      employeeID: new FormControl('', [Validators.required, Validators.min(1)]),
      shiftDate: new FormControl('', [Validators.required]),////////////////////////////////////////////////////////
      shiftTime: new FormControl('', [Validators.required]),
    });
    this.shiftService.getAllShifts().subscribe((shifts) => {
      this.allShifts = shifts;
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
  selectShiftById() {
    this.shifts= this.allShifts.filter((shift) => shift.employeeID == this.form.get('employeeID')?.value);
  }
}
