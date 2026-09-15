import { Directive, viewChildren } from '@angular/core';
import { TransactionListTableComponent } from './transaction-list-table/transaction-list-table.component';

@Directive()
export class BaseTransactionListComponent {
  readonly tables = viewChildren(TransactionListTableComponent);

  refreshTables() {
    return Promise.all(this.tables().map((t) => t.refreshTable()));
  }
}
