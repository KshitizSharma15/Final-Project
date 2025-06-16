import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../service/layout.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../pages/auth/service/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit{
  items!: MenuItem[];
  userId! : number;

  constructor(public layoutService: LayoutService , private authService: AuthService) {}

  toggleDarkMode() {
      this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
  ngOnInit(): void {
    this.userId = this.authService.getUserEmployeeId()!;
  }

}
