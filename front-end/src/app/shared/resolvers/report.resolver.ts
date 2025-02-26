import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Report } from '../models/report.model';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver {
  private readonly reportService = inject(ReportService);

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  async resolve(route: ActivatedRouteSnapshot): Promise<Report | undefined> {
    const reportId = String(route.paramMap.get('reportId'));
    if (!reportId) {
      return undefined;
    }
    return this.reportService.setActiveReportById(reportId);
  }
}
