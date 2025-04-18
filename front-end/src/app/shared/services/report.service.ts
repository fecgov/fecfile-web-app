import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { CommitteeAccount } from '../models/committee-account.model';
import { Report, ReportTypes } from '../models/report.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService, QueryParams } from './api.service';
import { Form3 } from '../models/form-3.model';
import { Form3X } from '../models/form-3x.model';
import { Form24 } from '../models/form-24.model';
import { Form99 } from '../models/form-99.model';
import { Form1M } from '../models/form-1m.model';
import { selectActiveReport } from 'app/store/active-report.selectors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getReportFromJSON(json: any): Report {
  if (json.report_type) {
    if (json.report_type === ReportTypes.F3) return Form3.fromJSON(json);
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
  protected readonly store = inject(Store);
  readonly report = this.store.selectSignal(selectActiveReport);

  protected readonly apiService = inject(ApiService);
  apiEndpoint = '/reports';

  public async getTableData(
    pageNumber = 1,
    ordering = 'form_type',
    params: QueryParams = {},
  ): Promise<ListRestResponse> {
    const response = await this.apiService.get<ListRestResponse>(
      `${this.apiEndpoint}/?page=${pageNumber}&ordering=${ordering}`,
      params,
    );
    response.results = response.results.map((item) => getReportFromJSON(item));
    return response;
  }

  public async getAllReports(): Promise<Report[]> {
    const rawReports = await this.apiService.get<Report[]>(this.apiEndpoint + '/');
    return rawReports.map((item) => getReportFromJSON(item));
  }

  public async get(reportId: string): Promise<Report> {
    const response = await this.apiService.get<Report>(`${this.apiEndpoint}/${reportId}/`);
    return getReportFromJSON(response);
  }

  public async create(report: Report, fieldsToValidate: string[] = []): Promise<Report> {
    const payload = this.preparePayload(report);
    const response = await this.apiService.post<Report>(`${this.apiEndpoint}/`, payload, {
      fields_to_validate: fieldsToValidate.join(','),
    });
    return getReportFromJSON(response);
  }

  public async update(report: Report, fieldsToValidate: string[] = []): Promise<Report> {
    const payload = this.preparePayload(report);
    const response = await this.apiService.put<Report>(`${this.apiEndpoint}/${report.id}/`, payload, {
      fields_to_validate: fieldsToValidate.join(','),
    });
    return getReportFromJSON(response);
  }

  public delete(report: Report): Promise<null> {
    return this.apiService.delete<null>(`${this.apiEndpoint}/${report.id}/`);
  }

  /**
   * Pulls the report from the back end, stores it in the ngrx store, and returns the report to the caller.
   * @param reportId
   * @returns Promise<Report>
   */
  async setActiveReportById(reportId: string | undefined): Promise<Report> {
    if (!reportId) throw new Error('Fecfile: No Report Id Provided.');
    const report = await this.get(reportId);
    this.store.dispatch(setActiveReportAction({ payload: report || new Form3X() }));
    return report;
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
    return this.apiService.post(`${this.apiEndpoint}/${report.id}/amend/`, {});
  }

  public startUnamendment(report: Report): Promise<string> {
    return this.apiService.post(`${this.apiEndpoint}/${report.id}/unamend/`, {});
  }

  preparePayload(item: Report): Record<string, unknown> {
    const payload = item.toJson();
    delete payload['schema'];
    return payload;
  }

  public fecUpdate(report: Report, committeeAccount?: CommitteeAccount): Promise<Report> {
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
