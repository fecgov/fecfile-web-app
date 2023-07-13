import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Report } from '../interfaces/report.interface';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableGuard  {
  constructor(private reportService: ReportService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const reportId = String(route.paramMap.get('reportId'));
    if (reportId) {
      return this.reportService
        .setActiveReportById(reportId)
        .pipe(map((report: Report) => this.reportService.isEditable(report)));
    }
    return of(false);
  }
}
