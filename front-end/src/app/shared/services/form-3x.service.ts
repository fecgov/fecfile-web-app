import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { setCashOnHandAction } from 'app/store/cash-on-hand.actions';
import { Report } from '../models/report.model';
import { ReportService } from './report.service';
import { F3xCoverageDates, Form3X, CashOnHand } from '../models/form-3x.model';
import { ApiService } from './api.service';
import { ListRestResponse } from '../models/rest-api.model';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends ReportService {
  override apiEndpoint = '/reports/form-3x';

  constructor(override apiService: ApiService, override store: Store) {
    super(apiService, store);
  }

  override getTableData(pageNumber = 1, ordering = 'form_type'): Observable<ListRestResponse> {
    return this.apiService.get<ListRestResponse>(`${this.apiEndpoint}/?page=${pageNumber}&ordering=${ordering}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => Form3X.fromJSON(item));
        this.setStoreCashOnHand(response.results);
        return response;
      })
    );
  }

  public getF3xCoverageDates(): Observable<F3xCoverageDates[]> {
    return this.apiService
      .get<F3xCoverageDates[]>(`${this.apiEndpoint}/coverage_dates`)
      .pipe(map((response) => response.map((fx3CoverageDate) => F3xCoverageDates.fromJSON(fx3CoverageDate))));
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
      const report: Form3X = reports[0] as Form3X;
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
}