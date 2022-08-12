import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { WebPrint } from '../models/web-print.model';
import { setActiveReportAction } from '../../store/active-report.actions';
import { Report } from '../interfaces/report.interface';
import { ReportService } from './report.service';


@Injectable({
  providedIn: 'root',
})
export class WebPrintService {
  constructor(private apiService: ApiService, private reportService: ReportService, private store: Store) {}

  /**
   * Gets the print-status of a report.
   *
   * @return     {Observable}  The WebPrint status.
   */
  public getStatus(reportId: number): void {
    this.reportService.get(reportId).subscribe((report)=>{
      this.store.dispatch(setActiveReportAction({ payload: report}));
    });
  }

  public submitPrintJob(reportId: number): void{
    this.apiService.post('/web-services/submit-to-webprint/', {
      report_id: reportId,
    }).subscribe(()=>{
      this.getStatus(reportId);
    });
  }
}
