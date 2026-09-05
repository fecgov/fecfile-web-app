import { Injectable } from '@angular/core';
import type { Form24, Form24Name } from '../models';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form24Service extends ReportService<Form24> {
  override apiEndpoint = '/reports/form-24';

  public async getNames(exclude_report_id?: string): Promise<Form24Name[]> {
    let url = `${this.apiEndpoint}/names/`;
    url = url + (exclude_report_id ? `?exclude_ids=${exclude_report_id}` : '');
    return await this.apiService.get<Form24Name[]>(url);
  }
}
