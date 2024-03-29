import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { ReportService } from './report.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebPrintService {
  constructor(
    private apiService: ApiService,
    private reportService: ReportService,
    private store: Store,
  ) {}

  /**
   * Gets the print-status of a report.
   *
   * @return     {Promise}  The WebPrint status.
   */
  public async getStatus(reportId: string): Promise<void> {
    await lastValueFrom(this.reportService.setActiveReportById(reportId));
  }

  public async submitPrintJob(reportId: string): Promise<void> {
    const request = this.apiService.post('/web-services/submit-to-webprint/', {
      report_id: reportId,
    });

    if (request) {
      await firstValueFrom(request);
      await this.getStatus(reportId);
    }
  }
}
