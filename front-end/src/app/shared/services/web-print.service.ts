import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ApiService } from './api.service';
import { WebPrint } from '../models/web-print.model';


@Injectable({
  providedIn: 'root',
})
export class WebPrintService {
  constructor(private apiService: ApiService, private store: Store) {}

  /**
   * Gets the print-status of a report.
   *
   * @return     {Observable}  The WebPrint status.
   */
  public getDetails(reportId: number): Observable<WebPrint> {
    return this.apiService.get<WebPrint>(`/web-services/${reportId}`);
  }
}
