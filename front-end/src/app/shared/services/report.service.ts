import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { CommitteeAccount } from '../models/committee-account.model';
import { Report, ReportTypes } from '../models/report.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService, QueryParams } from './api.service';
import { Form3X } from '../models/form-3x.model';
import { Form24 } from '../models/form-24.model';
import { Form99 } from '../models/form-99.model';
import { Form1M } from '../models/form-1m.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getReportFromJSON(json: any): Report {
  if (json.report_type) {
    if (json.report_type === ReportTypes.F1M) return Form1M.fromJSON(json);
    if (json.report_type === ReportTypes.F3X) return Form3X.fromJSON(json);
    if (json.report_type === ReportTypes.F24) return Form24.fromJSON(json);
    if (json.report_type === ReportTypes.F99) return Form99.fromJSON(json);
  }
  throw new Error('Fecfile: Cannot get report from JSON');
}

@Injectable({
  providedIn: 'root',
})
export class ReportService implements TableListService<Report> {
  apiEndpoint = '/reports';

  constructor(
    protected apiService: ApiService,
    protected store: Store,
  ) {}

  public getTableData(pageNumber = 1, ordering = 'form_type', params: QueryParams = {}): Observable<ListRestResponse> {
    return this.apiService
      .get<ListRestResponse>(`${this.apiEndpoint}/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => getReportFromJSON(item));
          return response;
        }),
      );
  }

  public getAllReports(): Promise<Report[]> {
    return firstValueFrom(this.apiService.get<Report[]>(this.apiEndpoint + '/')).then((rawReports) => {
      return rawReports.map((item) => getReportFromJSON(item));
    });
  }

  public get(reportId: string): Observable<Report> {
    return this.apiService
      .get<Report>(`${this.apiEndpoint}/${reportId}/`)
      .pipe(map((response) => getReportFromJSON(response)));
  }

  public create(report: Report, fieldsToValidate: string[] = []): Observable<Report> {
    const payload = this.preparePayload(report);
    return this.apiService
      .post<Report>(`${this.apiEndpoint}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => getReportFromJSON(response)));
  }

  public update(report: Report, fieldsToValidate: string[] = []): Observable<Report> {
    const payload = this.preparePayload(report);
    return this.apiService
      .put<Report>(`${this.apiEndpoint}/${report.id}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => getReportFromJSON(response)));
  }

  public delete(report: Report): Observable<null> {
    return this.apiService.delete<null>(`${this.apiEndpoint}/${report.id}/`);
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
      }),
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

  public startAmendment(report: Report): Promise<string> {
    return firstValueFrom(this.apiService.post(`${this.apiEndpoint}/${report.id}/amend/`, {}));
  }

  public startUnamendment(report: Report): Promise<string> {
    return firstValueFrom(this.apiService.post(`${this.apiEndpoint}/${report.id}/unamend/`, {}));
  }

  preparePayload(item: Report): Record<string, unknown> {
    const payload = item.toJson();
    delete payload['schema'];
    return payload;
  }

  public fecUpdate(report: Report, committeeAccount?: CommitteeAccount): Observable<Report> {
    const payload: Report = getReportFromJSON({
      ...report,
      committee_name: committeeAccount?.name,
      street_1: committeeAccount?.street_1,
      street_2: committeeAccount?.street_2,
      city: committeeAccount?.city,
      state: committeeAccount?.state,
      zip: committeeAccount?.zip,
    });
    return this.update(payload, ['committee_name', 'street_1', 'street_2', 'city', 'state', 'zip']);
  }
}
