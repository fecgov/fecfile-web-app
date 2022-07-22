import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from '../../store/active-report.actions';
import { Report } from '../interfaces/report.interface';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver implements Resolve<Report | undefined> {
  constructor(private store: Store, private reportService: ReportService) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Report | undefined> {
    const reportId = route.paramMap.get('reportId');
    if (reportId) {
      return this.reportService
        .get(Number(reportId))
        .pipe(tap((report) => this.store.dispatch(setActiveReportAction({ payload: report }))));
    }
    return of(undefined);
  }
}
