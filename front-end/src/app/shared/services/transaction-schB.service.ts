import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ApiService } from './api.service';
import { TransactionService } from './transaction.service';
import { SchBTransaction } from '../models/schb-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchBService extends TransactionService implements TableListService<SchBTransaction> {
  override tableDataEndpoint = '/transactions/schedule-b';

  constructor(override apiService: ApiService, override datePipe: DatePipe) {
    super(apiService, datePipe);
  }
}
