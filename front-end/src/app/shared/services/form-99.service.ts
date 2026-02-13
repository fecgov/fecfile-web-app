import { Injectable } from '@angular/core';
import { ReportService } from './report.service';
import type { Form99 } from '../models/reports/form-99.model';

@Injectable()
export class Form99Service extends ReportService<Form99> {
  override apiEndpoint = '/reports/form-99';
}
