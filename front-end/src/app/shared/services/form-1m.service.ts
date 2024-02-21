import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportService } from './report.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class Form1MService extends ReportService {
  override apiEndpoint = '/reports/form-1m';

  constructor(override apiService: ApiService, override store: Store) {
    super(apiService, store);
  }
}
