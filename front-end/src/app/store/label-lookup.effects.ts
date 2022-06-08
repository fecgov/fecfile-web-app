import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { first } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { selectLabelLookupAction, setLabelLookupAction } from './label-lookup.actions';
import { ApiService } from '../shared/services/api.service';
import { LabelList, ReportCodeLabelList } from '../shared/utils/label.utils';

@Injectable()
export class labelLookupEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  loadLabelLookup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectLabelLookupAction.type),
      first(),
      map(() => ({
        type: setLabelLookupAction.type,
        payload: this.apiService.get<ReportCodeLabelList>('/report-code-labels'),
      }))
    )
  );
}
