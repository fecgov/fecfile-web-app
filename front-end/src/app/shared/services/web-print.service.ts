import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ReportService } from './report.service';
import { Report } from '../models';

@Injectable({
  providedIn: 'root',
})
export class WebPrintService<T extends Report> {
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService<T>);

  public getStatus(reportId: string): Promise<T> {
    return this.reportService.setActiveReportById(reportId);
  }

  public submitPrintJob(reportId: string): Promise<object> {
    return this.apiService.post('/web-services/submit-to-webprint/', {
      report_id: reportId,
    });
  }
}
