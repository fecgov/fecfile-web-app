import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { userLoggedInAction } from './login.actions';
import { setCommitteeAccountDetailsAction, errorRetrievingAccountDetailsAction } from './committee-account.actions';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountsService } from 'app/shared/services/committee-accounts.service';

@Injectable()
export class CommitteeAccountEffects {
  constructor(private actions$: Actions, private committeeAccountsService: CommitteeAccountsService) {}

  loadCommitteeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userLoggedInAction.type),
      mergeMap((action: Action) =>
        this.committeeAccountsService.getDetails().pipe(
          map((committeeAccount: CommitteeAccount) => ({
            type: setCommitteeAccountDetailsAction.type,
            payload: committeeAccount,
          })),
          catchError(() => of({ type: errorRetrievingAccountDetailsAction.type }))
        )
      )
    )
  );
}
