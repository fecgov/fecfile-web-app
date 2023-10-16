import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReportService } from './report.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class Form99Service extends ReportService {
  override apiEndpoint = '/reports/form-99';

  constructor(override apiService: ApiService, override store: Store) {
    super(apiService, store);
  }
}
