import { Injectable } from '@angular/core';
import { ReportService } from './report.service';
import type { Form99 } from '../models';

@Injectable()
export class Form99Service extends ReportService<Form99> {
  override apiEndpoint = '/reports/form-99';
}
