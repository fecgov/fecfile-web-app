import { inject, Injectable } from '@angular/core';
import { ReportService } from '../services/report.service';
import type { ActivatedRouteSnapshot } from '@angular/router';
import type { Report } from '../models/reports/report.model';

@Injectable()
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
