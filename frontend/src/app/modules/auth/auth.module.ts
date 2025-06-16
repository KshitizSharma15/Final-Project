import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../pages/auth/service/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccessComponent } from '../../pages/auth/access/access.component';
import { ErrorComponent } from '../../pages/auth/error/error.component';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { LayoutModule } from '../layout/layout.module';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService } from 'primeng/api';
import { LoginComponent } from '../../pages/auth/login/login.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AccessComponent,
    ErrorComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    PasswordModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    LayoutModule,
    InputTextModule,
    RouterModule
  ],
  providers: [
    AuthService,
    ConfirmationService
  ]
})
export class AuthModule { }
