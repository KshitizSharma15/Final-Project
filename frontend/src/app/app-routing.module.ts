import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './app.routes';
import { AuthService } from './pages/auth/service/auth.service';

const routes: Routes = [
  ...appRoutes,
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule implements OnInit{
constructor(private authService: AuthService) {
  
}
  ngOnInit(): void {
    const role = this.authService.getUserRole();
  routes.at(2)?.children?.push({ path: '', redirectTo: role=="Manager"?'managers':'employees', pathMatch: 'full' },)
  }
}