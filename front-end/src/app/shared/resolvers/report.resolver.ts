import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Report } from '../interfaces/report.interface';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver implements Resolve<Report | undefined> {
  constructor(private reportService: ReportService) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Report | undefined> {
    const reportId = route.paramMap.get('reportId');
    if (reportId) {
      return this.reportService.get(Number(reportId));
    }
    return of(undefined);
  }
}
