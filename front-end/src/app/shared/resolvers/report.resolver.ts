import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { F3xSummary } from '../models/f3x-summary.model';
import { F3xSummaryService } from '../services/f3x-summary.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver implements Resolve<F3xSummary | undefined> {
  constructor(private f3xSummaryService: F3xSummaryService) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<F3xSummary | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<F3xSummary | undefined> {
    const id = route.paramMap.get('id');
    if (id) {
      return this.f3xSummaryService.get(Number(id));
    }
    return of(undefined);
  }
}
