import { Injectable } from '@angular/core';
import type { Form24, Form24Validation } from '../models';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form24Service extends ReportService<Form24> {
  override apiEndpoint = '/reports/form-24';

  public async nameValidationCheck(fullName: string, excludeReportIds?: string): Promise<Form24Validation> {
    return await this.apiService.get<Form24Validation>(
      `${this.apiEndpoint}/validation_check/?name=${fullName}&exclude_ids=${excludeReportIds || ''}`,
    );
  }
}
