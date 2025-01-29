import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableGuard {
  private readonly reportService = inject(ReportService);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const reportId = String(route.paramMap.get('reportId'));
    if (reportId) {
      const report = await this.reportService.setActiveReportById(reportId);
      return this.reportService.isEditable(report);
    }
    return false;
  }
}
