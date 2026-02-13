import { Injectable } from '@angular/core';
import { ReportService } from './report.service';
import type { Form24 } from '../models';

@Injectable()
export class Form24Service extends ReportService<Form24> {
  override apiEndpoint = '/reports/form-24';
}
