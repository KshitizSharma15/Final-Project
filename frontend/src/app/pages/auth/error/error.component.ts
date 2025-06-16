import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-error',
  standalone: false,
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  msg?: string;

  constructor(private router: ActivatedRoute, private authService: AuthService) {}

  redirectUrl! : string;

  ngOnInit(): void {
    this.msg = this.router.snapshot.params['msg'] || 'An unexpected error occurred.';
    this.redirectUrl = this.authService.getUserRole() === 'Manager' ? '/pages/managers' : '/pages/employees';
  }
}