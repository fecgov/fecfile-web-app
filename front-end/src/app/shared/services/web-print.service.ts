import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { ReportService } from './report.service';
import { firstValueFrom } from 'rxjs';

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
   * @return     {Observable}  The WebPrint status.
   */
  public getStatus(reportId: string): void {
    this.reportService.setActiveReportById(reportId).subscribe();
  }

  public submitPrintJob(reportId: string): Promise<object> {
    return firstValueFrom(
      this.apiService.post('/web-services/submit-to-webprint/', {
        report_id: reportId,
      }),
    );
  }
}
