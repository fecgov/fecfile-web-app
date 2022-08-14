import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Report } from '../interfaces/report.interface';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportIsEditableGuard implements CanActivate {
  constructor(private reportService: ReportService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const reportId = Number(route.paramMap.get('reportId'));
    if (reportId !== null) {
      return this.reportService
        .setActiveReportById(reportId)
        .pipe(map((report: Report) => this.reportService.isEditable(report)));
    }
    return of(false);
  }
}
