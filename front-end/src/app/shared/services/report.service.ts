import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { Report, ReportTypes } from '../models/report.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { Form3X } from '../models/form-3x.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService implements TableListService<Report> {
  apiEndpoint = '/reports';

  constructor(protected apiService: ApiService, protected store: Store) {}

  public getTableData(pageNumber = 1, ordering = ''): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'form_type';
    }
    // Pull list from F3X Summaries until we have more report models built
    return this.apiService.get<ListRestResponse>(`${this.apiEndpoint}/?page=${pageNumber}&ordering=${ordering}`).pipe(
      map((response: ListRestResponse) => {
        response.results = response.results.map((item) => Form3X.fromJSON(item));
        return response;
      })
    );
  }

  public get(reportId: string): Observable<ReportTypes> {
    return this.apiService
      .get<Report>(`${this.apiEndpoint}/${reportId}`)
      .pipe(map((response) => Form3X.fromJSON(response)));
  }

  public create(report: Report, fieldsToValidate: string[] = []): Observable<Report> {
    const payload = report.toJson();
    return this.apiService
      .post<Form3X>(`${this.apiEndpoint}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => Form3X.fromJSON(response)));
  }

  public update(report: Report, fieldsToValidate: string[] = []): Observable<Report> {
    const payload = report.toJson();
    return this.apiService
      .put<Form3X>(`${this.apiEndpoint}/${report.id}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => Form3X.fromJSON(response)));
  }

  public delete(report: Report): Observable<null> {
    return this.apiService.delete<null>(`${this.apiEndpoint}/${report.id}`);
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
        return this.store.dispatch(setActiveReportAction({ payload: report || new Form3X() }));
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
