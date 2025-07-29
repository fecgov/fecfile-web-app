import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class WebPrintService {
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService);

  /**
   * Gets the print-status of a report.
   *
   * @return     {Promise}  The WebPrint status.
   */
  public getStatus(reportId: string): void {
    this.reportService.setActiveReportById(reportId);
  }

  public submitPrintJob(reportId: string): Promise<{ submission_id: string }> {
    return this.apiService.post('/web-services/submit-to-webprint/', {
      report_id: reportId,
    });
  }
}
