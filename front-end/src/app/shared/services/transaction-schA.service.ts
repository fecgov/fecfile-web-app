import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchAService extends TransactionService {
  override tableDataEndpoint = '/transactions/schedule-a';

  constructor(override apiService: ApiService, override datePipe: DatePipe) {
    super(apiService, datePipe);
  }
}
