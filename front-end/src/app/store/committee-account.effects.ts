import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { userLoggedInAction } from './login.actions';
import {
  setCommitteeAccountDetailsAction,
  errorRetrievingAccountDetailsAction,
  refreshCommitteeAccountDetailsAction,
} from './committee-account.actions';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';

@Injectable()
export class CommitteeAccountEffects {
  constructor(private actions$: Actions, private committeeAccountService: CommitteeAccountService) {}

  loadCommitteeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshCommitteeAccountDetailsAction.type),
      mergeMap(() =>
        this.committeeAccountService.getDetails().pipe(
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
