import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  constructor(private apiService: ApiService, private f3xSummaryService: F3xSummaryService) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'form_type';
    }
    // Pull list from F3X Summaries until we have more report models built
    return this.apiService.get<ListRestResponse>(`/f3x-summaries/?page=${pageNumber}&ordering=${ordering}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => F3xSummary.fromJSON(item));
        return response;
      })
    );
  }

  public delete(report: Report): Observable<null> {
    return this.f3xSummaryService.delete(report as F3xSummary);
  }
}
