import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TransactionService } from './transaction.service';
import { Observable } from 'rxjs';
import { ListRestResponse } from '../models/rest-api.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchAService extends TransactionService {
  override tableDataEndpoint = '/transactions/transactions2';

  override getTableData(
    pageNumber?: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): Observable<ListRestResponse> {
    return super.getTableData(pageNumber, ordering, { ...params, schedules: 'A' });
  }

  constructor(override apiService: ApiService, override datePipe: DatePipe) {
    super(apiService, datePipe);
  }
}
