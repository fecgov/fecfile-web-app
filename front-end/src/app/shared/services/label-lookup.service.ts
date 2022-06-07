import { Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { LabelList } from '../utils/label.utils';
import { FecApiService } from './fec-api.service';
import { Store } from '@ngrx/store';
import { selectReportCodeLabel } from '../../store/label-lookup.selector'

@Injectable({
  providedIn: 'root',
})
export class LabelLookupService {
  constructor(private fecApiService: FecApiService, private store: Store) {}

  /**
   * Gets the label details
   *
   * @return     {Observable}  The label details.
   */
  public getDetails(): Observable<LabelList> {
    const reportCodeLabel$ = this.store.select(selectReportCodeLabel);
    return reportCodeLabel$.pipe(
      mergeMap(() => {
        return this.fecApiService.getLabels();
      })
    );
  }
}
