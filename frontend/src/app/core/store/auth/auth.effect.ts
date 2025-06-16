import { inject, Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { loginSucess ,logout } from './auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthEffects {
    actions$ = inject(Actions)

    storeUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(loginSucess),
            tap(({ authToken }) => { // Destructure the authToken correctly
                sessionStorage.setItem('authToken', JSON.stringify(authToken));
            })
        ),
        { dispatch: false }
    );

    clearUser$ = createEffect(
        () => this.actions$.pipe(
            ofType(logout),
            tap(() => {
                sessionStorage.removeItem('authToken');
            })
        ),
        { dispatch: false }
    );
}