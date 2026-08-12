import { Component, computed, inject } from '@angular/core';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { QueryParams } from 'app/shared/services/api.service';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';
import { TransactionListTableBaseComponent } from '../reports/transactions/transaction-list/transaction-list-table-base.component';

@Component({
  template: '',
})
export abstract class UnassociatedTransactionListTableBaseComponent extends TransactionListTableBaseComponent {
  protected readonly unassociatedTransactionService = inject(UnassociatedTransactionListService);

  public override rowActions: TableAction<TransactionListRecord>[] = [];

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage() };
    return params;
  });
}
