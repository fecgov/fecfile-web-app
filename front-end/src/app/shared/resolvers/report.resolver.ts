import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Report } from '../models/report.model';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver {
  constructor(private store: Store, private reportService: ReportService) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Report | undefined> {
    const reportId = String(route.paramMap.get('reportId'));
    if (!reportId) {
      return of(undefined);
    }
    return this.reportService.setActiveReportById(reportId);
  }
}
