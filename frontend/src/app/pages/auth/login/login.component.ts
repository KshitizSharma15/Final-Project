import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../models/Employee';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  constructor(private readonly authService: AuthService, private readonly router: Router){}

  form!: FormGroup;
  loading = false;
  showError = false;
  responseMessage? : string;

onSubmit(employee: Employee) {
      this.loading = true;
      this.authService.login({email:this.form.get('email')?.value, password:this.form.get('password')?.value}).subscribe({
          next: (response: string) => {
              this.loading = false;
              this.responseMessage= 'Login Success'
          },
          error: (error: HttpErrorResponse) => {
              this.loading = false;
              this.showError = true;
              if (error.error && typeof error.error === 'object' && 'message' in error.error) {
                this.responseMessage = error.error.message; // Access the backend's message
              } else if (error.error && typeof error.error === 'string') {
                this.responseMessage = error.error; // Handle potential string error messages
              } else {
                this.responseMessage = `Login failed: ${error.status} ${error.statusText}`; // Default error message
              }
            }
      });

  }

  ngOnInit(): void {
          this.form = new FormGroup({
              email: new FormControl('', [Validators.required, Validators.email]),
              password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]),
          });
      }

      get emailErrorMessage() {
          if (this.form.get('email')?.hasError('required')) {
              return 'Email is required';
          }
          if (this.form.get('email')?.hasError('pattern')) {
              return 'Email must be a enterprise email';
          }
          return '';
      }

      get passwordErrorMessage() { ///////////////////////////////////////////////////////////////
          if (this.form.get('password')?.hasError('required')) {
              return 'Password is required';
          }
          if (this.form.get('password')?.hasError('pattern')) {
              return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
          }
          return '';
      }


}