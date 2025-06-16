import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { AuthService } from '../../../pages/auth/service/auth.service';
import { Observable } from 'rxjs';
import { AuthState } from '../../../core/store/auth/auth.state';
import { select, Store } from '@ngrx/store';
import { selectAuthState } from '../../../core/store/auth/auth.selector';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  loading = false;
  isLoggedIn = false
  constructor(
    public el: ElementRef,
    private readonly authservice: AuthService,
    private readonly store: Store,
    private readonly cd: ChangeDetectorRef,
  ) {}
  authToken$!: Observable<AuthState | null>;
  ngOnInit(): void {
    this.store.pipe(select(selectAuthState)).subscribe(
      (status) => this.isLoggedIn = status.authToken !== null
    );
    
  }
  handleLogout() {
    this.loading = true;
    this.authservice.logout();
    this.loading = false;
    this.cd.detectChanges();
  }
}