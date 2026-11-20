import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, Router } from '@angular/router';
import { Report } from '../models/reports/report.model';
import { ReportService } from '../services/report.service';

export const reportResolver = async (route: ActivatedRouteSnapshot): Promise<Report | RedirectCommand> => {
  const reportService: ReportService<Report> = inject(ReportService);
  const router = inject(Router);

  const reportId = route.paramMap.get('reportId');
  if (!reportId) return new RedirectCommand(router.parseUrl('/reports'));

  try {
    return await reportService.setActiveReportById(reportId);
  } catch {
    return new RedirectCommand(router.parseUrl('/reports'));
  }
};
