import { Injectable } from '@angular/core';
import { ReportService } from './report.service';
import { Form1M } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Form1MService extends ReportService<Form1M> {
  override apiEndpoint = '/reports/form-1m';
}
