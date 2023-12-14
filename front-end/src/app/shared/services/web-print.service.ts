import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ApiService } from './api.service';
import { ReportService } from './report.service';
import { Observable } from 'rxjs';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class WebPrintService {
  constructor(private apiService: ApiService, private reportService: ReportService) {}

  /**
   * Gets the print-status of a report.
   *
   * @return     {Observable}  The WebPrint status.
   */
  public getStatus(reportId: string): Observable<Report> {
    return this.reportService.get(reportId);
  }

  public submitPrintJob(reportId: string): Observable<Report | undefined> {
    const request = this.apiService.post('/web-services/submit-to-webprint/', {
      report_id: reportId,
    });

    if (request) {
      return this.getStatus(reportId);
    }
    return of(undefined);
  }
}
