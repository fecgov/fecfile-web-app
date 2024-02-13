import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { userLoggedOutAction } from './login.actions';
import { ApiService } from 'app/shared/services/api.service';
import { LoginService } from 'app/shared/services/login.service';
import { Store } from '@ngrx/store';
import { setCommitteeAccountDetailsAction } from './committee-account.actions';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private apiService: ApiService,
    private loginService: LoginService,
    private store: Store,
  ) {}

  userLoggedOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userLoggedOutAction.type),
        tap(() => {
          this.apiService.get('/auth/logout').subscribe(() => {
            localStorage.clear();
            this.store.dispatch(setCommitteeAccountDetailsAction({ payload: new CommitteeAccount() }));
            this.loginService.clearUserLoggedInCookies();
            this.router.navigate(['/login']);
          });
        }),
      ),
    { dispatch: false },
  );
}
