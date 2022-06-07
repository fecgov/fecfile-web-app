import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, first } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { selectLabelLookupAction } from './label-lookup.actions';
import { ApiService } from '../shared/services/api.service';
import { LabelList } from '../shared/utils/label.utils';

@Injectable()
export class labelLookupEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  loadCommitteeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectLabelLookupAction.type),
      first(),
      mergeMap(() => this.getLabels())
    )
  );

  getLabels() {
    return this.apiService.get<LabelList>('/report-code-labels');
  }
}

/*import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import {
  setLabelLookupAction,
  errorRetrievingLabelLookupAction,
  selectLabelLookupAction,
} from './label-lookup.actions';
import { LabelList } from '../shared/utils/label.utils';
import { ApiService } from '../shared/services/api.service';
import { ApiService } from 'app/shared/services/api.service';

@Injectable()
export class labelLookupEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  loadLabelLookup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectLabelLookupAction.type),
      mergeMap(() =>
          this.apiService.get("/report-code-labels");
      )
    )
  );
}
*/
