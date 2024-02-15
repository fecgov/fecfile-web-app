import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { userLoggedOutAction } from './login.actions';
import { ApiService } from 'app/shared/services/api.service';

@Injectable()
export class LoginEffects {
  userLoggedOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userLoggedOutAction.type),
        tap(() => {
          this.apiService.get('/auth/logout').subscribe(() => {
            this.router.navigate(['/login']);
          });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private apiService: ApiService,
  ) {}
}
