import { Component, computed, inject } from '@angular/core';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { QueryParams } from 'app/shared/services/api.service';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';
import { TransactionListTableBaseComponent } from '../reports/transactions/transaction-list/transaction-list-table-base.component';

const loanReceipts = ['LOAN_RECEIVED_FROM_BANK_RECEIPT', 'LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT', 'LOAN_MADE'];
const loansDebts = [
  'LOAN_RECEIVED_FROM_INDIVIDUAL',
  'LOAN_RECEIVED_FROM_BANK',
  'LOAN_BY_COMMITTEE',
  'DEBT_OWED_BY_COMMITTEE',
  'DEBT_OWED_TO_COMMITTEE',
];

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
