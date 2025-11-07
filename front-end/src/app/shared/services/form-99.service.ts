import { Injectable } from '@angular/core';
import { ReportService } from './report.service';
import { Form99 } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Form99Service extends ReportService<Form99> {
  override apiEndpoint = '/reports/form-99';
}
