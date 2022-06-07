import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { F3xSummaryService } from './f3x-summary.service';
import { F3xSummary } from '../models/f3x-summary.model';
import { ApiService } from './api.service';
import { LabelList } from '../../shared/utils/label.utils';

@Injectable({
  providedIn: 'root',
})
export class ReportCodeLabelService implements TableListService<LabelList> {
  constructor(private apiService: ApiService, private f3xSummaryService: F3xSummaryService) {}

  public getTableData(): Observable<ListRestResponse> {
    // Pull list from F3X Summaries until we have more report models built
    return this.apiService.get<ListRestResponse>(`/report-code-labels`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => F3xSummary.fromJSON(item));
        return response;
      })
    );
  }

  /*public get(reportId: number): Observable<Report> {
    return this.f3xSummaryService.get(reportId);
  }*/
}
