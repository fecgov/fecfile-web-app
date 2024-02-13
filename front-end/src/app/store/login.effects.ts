import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { userLoggedOutAction } from './login.actions';
import { ApiService } from 'app/shared/services/api.service';
import { LoginService } from 'app/shared/services/login.service';

@Injectable()
export class LoginEffects {
  loginService: LoginService;
  constructor(
    private actions$: Actions,
    private router: Router,
    private apiService: ApiService,
    loginService: LoginService,
  ) {
    this.loginService = loginService;
  }

  userLoggedOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userLoggedOutAction.type),
        tap(() => {
          this.apiService.get('/auth/logout').subscribe(() => {
            localStorage.clear();
            this.loginService.clearUserLoggedInCookies();
            this.router.navigate(['/login']);
          });
        }),
      ),
    { dispatch: false },
  );
}
