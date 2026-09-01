import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Report } from '../models/reports/report.model';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportResolver {
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);

  async resolve(route: ActivatedRouteSnapshot): Promise<Report | undefined> {
    const reportId = route.paramMap.get('reportId');

    if (!reportId) {
      await this.router.navigateByUrl('/reports');
      return undefined;
    }

    try {
      return await this.reportService.setActiveReportById(reportId);
    } catch {
      await this.router.navigateByUrl('/reports');
      return undefined;
    }
  }
}
