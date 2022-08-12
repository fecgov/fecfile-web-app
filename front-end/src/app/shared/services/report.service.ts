import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { cohNeededAction } from 'app/store/coh-needed.actions';
import { Report } from '../interfaces/report.interface';
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
        this.storeCohNeededFlag(response.results);
        return response;
      })
    );
  }

  public get(reportId: number): Observable<Report> {
    return this.f3xSummaryService.get(reportId);
  }

  public delete(report: Report): Observable<null> {
    return this.f3xSummaryService.delete(report as F3xSummary);
  }

  /**
   * Set the cohNeeded boolean flag in the store.
   * Currently does not determine COH by looking at amendments or other report types
   * @param reports - List of reports on the current page of the Reports table
   */
  private storeCohNeededFlag(reports: Report[]) {
    if (reports.length > 1) {
      this.store.dispatch(cohNeededAction({ payload: false }));
    } else {
      this.store.dispatch(cohNeededAction({ payload: true }));
    }
  }
}
