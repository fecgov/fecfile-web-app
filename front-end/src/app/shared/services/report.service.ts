import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setActiveReportAction } from 'app/store/active-report.actions';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ReportTypes } from '../models/reports/report.model';
import type { Report } from '../models/reports/report.model';
import type { ListRestResponse } from '../models/rest-api.model';
import type { CommitteeAccount } from '../models/committee-account.model';
import { ApiService, QueryParams } from './api.service';

export async function getReportFromJSON<T extends Report>(json: { report_type: ReportTypes }): Promise<T> {
  switch (json.report_type) {
    case ReportTypes.F3: {
      const { Form3 } = await import('../models/reports/form-3.model');
      return Form3.fromJSON(json) as unknown as T;
    }
    case ReportTypes.F3X: {
      const { Form3X } = await import('../models/reports/form-3x.model');
      return Form3X.fromJSON(json) as unknown as T;
    }
    case ReportTypes.F24: {
      const { Form24 } = await import('../models/reports/form-24.model');
      return Form24.fromJSON(json) as unknown as T;
    }
    case ReportTypes.F1M: {
      const { Form1M } = await import('../models/reports/form-1m.model');
      return Form1M.fromJSON(json) as unknown as T;
    }
    case ReportTypes.F99: {
      const { Form99 } = await import('../models/reports/form-99.model');
      return Form99.fromJSON(json) as unknown as T;
    }
  }
}

@Injectable()
export class ReportService<T extends Report> implements TableListService<Report> {
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
    response.results = await Promise.all(response.results.map((item) => getReportFromJSON<T>(item)));
    return response;
  }

  public async getAllReports(): Promise<T[]> {
    const rawReports = await this.apiService.get<T[]>(this.apiEndpoint + '/');
    return Promise.all(rawReports.map((item) => getReportFromJSON<T>(item)));
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
    this.store.dispatch(setActiveReportAction({ payload: report }));
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

  async fecUpdate(report: T, committeeAccount?: CommitteeAccount): Promise<T> {
    const payload: T = await getReportFromJSON<T>({
      ...report,
      committee_name: report.committee_name ?? committeeAccount?.name,
      street_1: report.street_1 ?? committeeAccount?.street_1,
      street_2: report.street_2 ?? committeeAccount?.street_2,
      city: report.city ?? committeeAccount?.city,
      state: report.state ?? committeeAccount?.state,
      zip: report.zip ?? committeeAccount?.zip,
    });
    return this.update(payload, ['committee_name', 'street_1', 'street_2', 'city', 'state', 'zip']);
  }
}
