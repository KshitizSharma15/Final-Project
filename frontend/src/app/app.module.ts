import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withFetch , HTTP_INTERCEPTORS, HttpClient, HttpClientModule, withInterceptors} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './modules/layout/layout.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ButtonModule } from 'primeng/button';
import { EmployeesModule } from './modules/employee/employees/employees.module';
import { ManagersModule } from './modules/manager/managers/managers.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './core/store/auth/auth.reducer';
import { AuthEffects } from './core/store/auth/auth.effect';
import { EffectsModule } from '@ngrx/effects';
import { AuthInterceptor } from './core/interceptors/interceptor';
import { AuthGuard } from './core/gaurds/auth/auth.gaurd';
import { AuthService } from './pages/auth/service/auth.service';
import { ManagerGuard } from './core/gaurds/auth/manager.guard';
import { EmployeeGuard } from './core/gaurds/auth/employee.guard';
import { EmployeeProfileComponent } from './pages/managers/employee-profile/employee-profile.component';
import { ShiftProfileComponent } from './pages/managers/shift-profile/shift-profile.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    AuthModule,
    ButtonModule,
    EmployeesModule,
    ManagersModule,
    ButtonModule,
    ToastModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    HttpClientModule
  ],
  exports: [NotFoundComponent],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
    }),
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthService,
    AuthGuard,
    EmployeeGuard,
    ManagerGuard
  ],
  
  bootstrap: [AppComponent],
})
export class AppModule {}
