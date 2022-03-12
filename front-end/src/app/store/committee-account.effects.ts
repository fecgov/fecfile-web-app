import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountsService } from 'app/shared/services/committee-accounts.service';

@Injectable()
export class CommitteeAccountEffects {
  constructor(private actions$: Actions, private committeeAccountsService: CommitteeAccountsService) {}

  loadCommitteeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Login] User Logged In'),
      mergeMap(() =>
        this.committeeAccountsService.getDetails().pipe(
          map((committeeAccount: CommitteeAccount) => ({
            type: '[Committee Account] Account Retrieved',
            payload: committeeAccount,
          })),
          catchError(() => of({ type: '[Committee Account] Account Loaded Error' }))
        )
      )
    )
  );
}
