import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { userLoggedOutAction } from './login.actions';

@Injectable()
export class LoginEffects {
  constructor(private actions$: Actions, private router: Router) {}

  userLoggedOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userLoggedOutAction.type),
        tap((action: Action) => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );
}
