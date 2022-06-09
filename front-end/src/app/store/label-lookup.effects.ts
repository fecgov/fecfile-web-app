import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { first, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import {
  setLabelLookupAction,
  errorRetrievingLabelLookupAction,
  updateLabelLookupAction,
} from './label-lookup.actions';
import { ApiService } from '../shared/services/api.service';
import { LabelList, ReportCodeLabelList } from '../shared/utils/label.utils';

@Injectable()
export class LabelLookupEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {
    console.log('LabelLookupEffects', actions$, apiService);
  }

  loadLabelLookup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateLabelLookupAction.type),
      first(),
      mergeMap(() =>
        this.apiService.get<ReportCodeLabelList>('/report-code-labels').pipe(
          map((reportCodeLabelList: ReportCodeLabelList) => ({
            type: setLabelLookupAction.type,
            payload: reportCodeLabelList,
          })),
          catchError(() => of({ type: errorRetrievingLabelLookupAction.type }))
        )
      )
    )
  );
}
