import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../pages/auth/service/auth.service';
import { select, Store } from '@ngrx/store';
import { selectAuthState } from '../../../core/store/auth/auth.selector';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
  ) {}
  model: MenuItem[] = [];

  updateModel() {
    const role = this.authService.getUserRole();
    if (role === 'Manager') {
      this.model = [
        {
          label: 'Home',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/pages/managers'],
            },
          ],
        },
        {
          label: 'MANAGER',
          items: [
            {
              label: 'Employee List',
              icon: 'pi pi-fw pi-users',
              routerLink: ['/pages/managers/employee-list'],
            },
            {
              label: 'Add Employee',
              icon: 'pi pi-fw pi-user-plus',
              routerLink: ['/pages/managers/add'],
            },

            {
              label: 'Shift List',
              icon: 'pi pi-fw pi-clock',
              routerLink: ['/pages/managers/shifts'],
            },
            {
              label: 'Add Shift',
              icon: 'pi pi-fw pi-calendar-plus',
              routerLink: ['/pages/managers/shifts/add'],
            },

            {
              label: 'Shift Request',
              icon: 'pi pi-fw pi-calendar-clock',
              routerLink: ['/pages/managers/shifts/request'],
            },
            {
              label: 'Leave Requests',
              icon: 'pi pi-fw pi-clipboard',
              routerLink: ['/pages/managers/leave-requests'],
            },
          ],
        },
      ];
    } else if(role ==='Employee') { //////////////////////////////////////////////////
      this.model = [
        {
          label: 'Home',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/pages/employees'],
            },
          ],
        },
        {
          label: 'EMPLOYEE',
          items: [
            {
              label: 'Shift List',
              icon: 'pi pi-fw pi-clock',
              routerLink: ['/pages/employees/shifts'],
            },
            {
              label: 'Shift Request',
              icon: 'pi pi-fw pi-calendar-clock',
              routerLink: ['/pages/employees/shifts/request'],
            },
            {
              label: 'Request Leave',
              icon: 'pi pi-fw pi-clipboard',
              routerLink: ['/pages/employees/leave-requests'],
            },
            {
              label: 'Attendance',
              icon: 'pi pi-fw pi-check-square',
              routerLink: ['/pages/employees/attendance'],
            },
          ],
        },
      ];
    }
    else{
      this.model = [
        {
          label: 'Home',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/auth/login'],
            },
          ],
        },
      ]
    }
  }

  ngOnInit() {
        this.store.pipe(select(selectAuthState)).subscribe(
          (status) => this.updateModel()
        );
  }
}