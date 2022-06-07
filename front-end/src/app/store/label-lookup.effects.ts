import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {
  setLabelLookupAction,
  errorRetrievingLabelLookupAction,
  refreshLabelLookupAction,
} from './label-lookup.actions';
import { LabelList } from '../shared/utils/label.utils';
//import { LabelLookupService } from '../shared/services/label-lookup.service';
import { ReportCodeLabelService } from '../shared/services/report-code-label.service';

@Injectable()
export class labelLookupEffects {
  constructor(private actions$: Actions, private labelLookupService: ReportCodeLabelService) {}

  loadLabelLookup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(refreshLabelLookupAction.type),
      mergeMap(() =>
        this.labelLookupService.getDetails().pipe(
          map((labelLookup: LabelList) => ({
            type: setLabelLookupAction.type,
            payload: labelLookup,
          })),
          catchError(() => of({ type: errorRetrievingLabelLookupAction.type }))
        )
      )
    )
  );
}
