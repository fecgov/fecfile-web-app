import { Injectable } from '@angular/core';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form24Service extends ReportService {
  override apiEndpoint = '/reports/form-24';
}
