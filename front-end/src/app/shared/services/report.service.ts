import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { setCashOnHandAction } from 'app/store/cash-on-hand.actions';
import { Report, CashOnHand } from '../interfaces/report.interface';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { F3xSummaryService } from './f3x-summary.service';
import { F3xSummary } from '../models/f3x-summary.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService implements TableListService<Report> {
  constructor(private apiService: ApiService, private f3xSummaryService: F3xSummaryService, private store: Store) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'form_type';
    }
    // Pull list from F3X Summaries until we have more report models built
    return this.apiService.get<ListRestResponse>(`/f3x-summaries/?page=${pageNumber}&ordering=${ordering}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => F3xSummary.fromJSON(item));
        this.setStoreCashOnHand(response.results);
        return response;
      })
    );
  }

  public get(reportId: string): Observable<Report> {
    return this.f3xSummaryService.get(reportId);
  }

  public delete(report: Report): Observable<null> {
    return this.f3xSummaryService.delete(report as F3xSummary);
  }

  public startAmendment(report: Report): Observable<string> {
    return this.f3xSummaryService.startAmendment(report as F3xSummary);
  }

  /**
   * Dispatches the Cash On Hand data for the first report in the list to the ngrx store.
   * @param reports - List of reports on the current page of the Reports table
   */
  public setStoreCashOnHand(reports: Report[]) {
    let payload: CashOnHand | undefined;

    if (reports.length === 0) {
      payload = {
        report_id: undefined,
        value: undefined,
      };
    } else if (reports.length > 0) {
      const report: F3xSummary = reports[0] as F3xSummary;
      const value = report.L6a_cash_on_hand_jan_1_ytd ?? 1.0;
      payload = {
        report_id: report.id,
        value: value,
      };
    }
    if (payload) {
      this.store.dispatch(setCashOnHandAction({ payload: payload }));
    }
  }

  /**
   * Pulls the report from the back end, stores it in the ngrx store, and returns the report to the caller.
   * @param reportId
   * @returns Observable<Report>
   */
  setActiveReportById(reportId: string | undefined): Observable<Report> {
    if (!reportId) throw new Error('Fecfile: No Report Id Provided.');
    return this.get(reportId).pipe(
      tap((report) => {
        return this.store.dispatch(setActiveReportAction({ payload: report || new F3xSummary() }));
      })
    );
  }

  /**
   * Returns true if the report is in "edit" mode
   * @param report
   * @returns boolean
   */
  isEditable(report: Report | undefined): boolean {
    const uploadSubmission = report?.upload_submission;
    const fecStatus = report?.upload_submission?.fec_status;
    const fecfileTaskState = report?.upload_submission?.fecfile_task_state;
    return !uploadSubmission || fecStatus == 'REJECTED' || fecfileTaskState == 'FAILED';
  }
}
