import { Injectable } from '@angular/core';
import { ReportService } from './report.service';
import { Form24 } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Form24Service extends ReportService<Form24> {
  override apiEndpoint = '/reports/form-24';
}
