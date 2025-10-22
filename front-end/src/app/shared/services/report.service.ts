import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { TableListService } from '../interfaces/table-list-service.interface';
import { CommitteeAccount } from '../models/committee-account.model';
import { Form1M } from '../models/form-1m.model';
import { Form24 } from '../models/form-24.model';
import { Form3 } from '../models/form-3.model';
import { Form3X } from '../models/form-3x.model';
import { Form99 } from '../models/form-99.model';
import { Report, ReportTypes } from '../models/report.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService, QueryParams } from './api.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getReportFromJSON<T extends Report>(json: any): T {
  if (json.report_type === ReportTypes.F3) return Form3.fromJSON(json) as unknown as T;
  if (json.report_type === ReportTypes.F1M) return Form1M.fromJSON(json) as unknown as T;
  if (json.report_type === ReportTypes.F3X) return Form3X.fromJSON(json) as unknown as T;
  if (json.report_type === ReportTypes.F24) return Form24.fromJSON(json) as unknown as T;
  if (json.report_type === ReportTypes.F99) return Form99.fromJSON(json) as unknown as T;
  throw new Error('FECfile+: Cannot get report from JSON');
}

@Injectable({
  providedIn: 'root',
})
export class ReportService<T extends Report> implements TableListService<T> {
  protected readonly apiService = inject(ApiService);
  protected readonly store = inject(Store);
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

  public async getAllReports(): Promise<T[]> {
    const rawReports = await this.apiService.get<T[]>(this.apiEndpoint + '/');
    return rawReports.map((item) => getReportFromJSON(item));
  }

  public async get(reportId: string): Promise<T> {
    const response = await this.apiService.get<T>(`${this.apiEndpoint}/${reportId}/`);
    return getReportFromJSON<T>(response);
  }

  public async create(report: T, fieldsToValidate: string[] = []): Promise<T> {
    const payload = this.preparePayload(report);
    const response = await this.apiService.post<T>(`${this.apiEndpoint}/`, payload, {
      fields_to_validate: fieldsToValidate.join(','),
    });
    return getReportFromJSON<T>(response);
  }

  public async update(report: T, fieldsToValidate: string[] = []): Promise<T> {
    const payload = this.preparePayload(report);
    const response = await this.apiService.put<T>(`${this.apiEndpoint}/${report.id}/`, payload, {
      fields_to_validate: fieldsToValidate.join(','),
    });
    return getReportFromJSON<T>(response);
  }

  public async updateWithAllowedErrorCodes(
    report: T,
    allowedErrorCodes: number[],
    fieldsToValidate: string[] = [],
  ): Promise<T> {
    const payload = this.preparePayload(report);
    const response = await this.apiService.put<T>(
      `${this.apiEndpoint}/${report.id}/`,
      payload,
      {
        fields_to_validate: fieldsToValidate.join(','),
      },
      allowedErrorCodes,
    );
    if (!response.body) {
      throw new Error();
    }
    return getReportFromJSON<T>(response.body);
  }

  public delete(report: T): Promise<null> {
    return this.apiService.delete<null>(`${this.apiEndpoint}/${report.id}/`);
  }

  /**
   * Pulls the report from the back end, stores it in the ngrx store, and returns the report to the caller.
   * @param reportId
   * @returns Promise<T>
   */
  async setActiveReportById(reportId: string | undefined): Promise<T> {
    if (!reportId) throw new Error('FECfile+: No Report Id Provided.');
    const report = await this.get(reportId);
    this.store.dispatch(setActiveReportAction({ payload: report || new Form3X() }));
    return report;
  }

  /**
   * Returns true if the report is in "edit" mode
   * @param report
   * @returns boolean
   */
  isEditable(report: T | undefined): boolean {
    const uploadSubmission = report?.upload_submission;
    const fecStatus = report?.upload_submission?.fec_status;
    const fecfileTaskState = report?.upload_submission?.fecfile_task_state;
    return !uploadSubmission || fecStatus == 'REJECTED' || fecfileTaskState == 'FAILED';
  }

  public startAmendment(report: T): Promise<string> {
    return this.apiService.post(`${this.apiEndpoint}/${report.id}/amend/`, {});
  }

  public startUnamendment(report: T): Promise<string> {
    return this.apiService.post(`${this.apiEndpoint}/${report.id}/unamend/`, {});
  }

  preparePayload(item: T): Record<string, unknown> {
    const payload = item.toJson();
    delete payload['schema'];
    return payload;
  }

  public fecUpdate(report: T, committeeAccount?: CommitteeAccount): Promise<T> {
    const payload: T = getReportFromJSON({
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
