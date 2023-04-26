import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService } from './api.service';
import { TransactionService } from './transaction.service';
import { SchATransaction } from '../models/scha-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchAService extends TransactionService implements TableListService<SchATransaction> {
  override tableDataEndpoint = '/transactions/schedule-a';

  constructor(override apiService: ApiService, override datePipe: DatePipe) {
    super(apiService, datePipe);
  }
}
