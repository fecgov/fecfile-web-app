import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TransactionService } from './transaction.service';
import { ListRestResponse } from '../models/rest-api.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchBService extends TransactionService {
  constructor(override apiService: ApiService, override datePipe: DatePipe) {
    super(apiService, datePipe);
  }

  override getTableData(
    pageNumber = 1,
    ordering = '',
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {}
  ): Observable<ListRestResponse> {
    // The table data for the Schedule C loans also includes the Schedule D debts.
    params['schedules'] = 'B,E';
    return super.getTableData(pageNumber, ordering, params);
  }
}
