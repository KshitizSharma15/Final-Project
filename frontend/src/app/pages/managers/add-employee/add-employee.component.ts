import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../../../models/Employee';
import { EmployeeServiceManager } from '../service/employee.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-employee',
  standalone: false,
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss',
})
export class AddEmployeeComponent {
  form!: FormGroup;
  userRegistered = false;
  loading = false;

  constructor(
    private readonly employeeService: EmployeeServiceManager,
    private readonly router: Router,
  ) {}

  onSubmit() {
    this.loading = true;
    this.employeeService
      .createEmployee({ 
        employeeID: this.form.get('id')?.value,
        employeeEmail: this.form.get('email')?.value, 
        employeeName: this.form.get('name')?.value,
        password: this.form.get('password')?.value,
        employeePhoneNumber: this.form.get('phone')?.value,
        role: this.form.get('role')?.value,
      })
      .subscribe({
        next: () => {
          this.userRegistered = true;
          this.loading = false;
          this.router.navigate(['/pages/managers/employee-list']);
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
      id: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z ]+$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        ),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        ),
        this.passwordMatchValidator(),
      ]),
      role: new FormControl('', [Validators.required]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
    });
  }

  options = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Employee', value: 'Employee' },
  ];

  private passwordMatchValidator() {
    return (control: FormControl): ValidationErrors | null => {
      const password = this.form?.get('password')?.value;
      const confirmPassword = control.value;
      return password && confirmPassword && password !== confirmPassword
        ? { valid: false }
        : null;
    };
  }

  get idErrorMessage() {
    if (this.form.get('id')?.hasError('required')) {
      return 'Minimum three characters id is required';
    }
    if (this.form.get('id')?.hasError('minLength')) {
      return 'Id should have atleast 3 characters';
    }
    return '';
  }

  get emailErrorMessage() {
    if (this.form.get('email')?.hasError('required')) {
      return 'Email is required';
    }
    if (this.form.get('email')?.hasError('email')) {
      return 'Email is invalid';
    }
    return '';
  }
  get nameErrorMessage() {
    if (this.form.get('name')?.hasError('required')) {
      return 'Name is required';
    }
    if (this.form.get('name')?.hasError('pattern')) {
      return 'Name must contain only letters and spaces';
    }
    return '';
  }
  get passwordErrorMessage() {
    if (this.form.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    if (this.form.get('password')?.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    if (
      this.form.get('password')?.value !==
      this.form.get('confirmPassword')?.value
    ) {
      return 'Passwords are not matching.';
    }
    return '';
  }
  get confirmPasswordErrorMessage() {
    if (this.form.get('confirmPassword')?.hasError('required')) {
      return 'Confirm Password is required';
    }
    if (this.form.get('confirmPassword')?.hasError('pattern')) {
      return 'Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    if (
      this.form.get('password')?.value !==
      this.form.get('confirmPassword')?.value
    ) {
      return 'Passwords are not matching.';
    }
    return '';
  }
  get roleErrorMessage() {
    if (this.form.get('role')?.hasError('required')) {
      return 'Role is required';
    }
    return '';
  }

  get phoneErrorMessage() {
    if (this.form.get('phone')?.hasError('required')) {
      return 'Phone number is required';
    }
    if (this.form.get('phone')?.hasError('pattern')) {
      return 'Phone number must be a valid 10-digit number';
    }
    return '';
  }
}
