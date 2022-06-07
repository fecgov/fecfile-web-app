import { Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { LabelList } from '../utils/label.utils';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { selectReportCodeLabel } from '../../store/label-lookup.selectors';

@Injectable({
  providedIn: 'root',
})
export class LabelLookupService {
  constructor(private apiService: ApiService, private store: Store) {}

  /**
   * Gets the label details
   *
   * @return     {Observable}  The label details.
   */
  public getDetails(): Observable<LabelList> {
    const reportCodeLabel$ = this.store.select(selectReportCodeLabel);
    return reportCodeLabel$.pipe(
      mergeMap(() => {
        return this.apiService.get('/report-code-labels');
      })
    );
  }
}
