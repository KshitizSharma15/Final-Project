import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../store/auth/auth.selector';
import { AuthState } from '../../store/auth/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectAuthState).pipe(
      map((authState: AuthState) => {
        if (authState.authToken) {
          // If logged in, allow access to the route
          return true;
        } else {
          // If not logged in, redirect to the login page
          console.log('AuthGuard: User not logged in, redirecting to /login');
          return this.router.createUrlTree(['/auth/login']); // Return a UrlTree for redirection
        }
      })
    );
  }
}
