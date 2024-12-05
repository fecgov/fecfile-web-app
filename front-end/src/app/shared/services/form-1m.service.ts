import { Injectable } from '@angular/core';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form1MService extends ReportService {
  override apiEndpoint = '/reports/form-1m';
}
