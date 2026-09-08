import { Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';
import { TransactionReceiptsComponent } from 'app/reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component';
import { ColumnDefinition, TableComponent } from '../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';

@Component({
  selector: 'app-unassociated-transaction-receipts',
  templateUrl: '../../reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component.html',
  styleUrls: [
    '../../reports/transactions/transaction.scss',
    '../../reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component.scss',
  ],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
})
export class UnassociatedTransactionReceiptsComponent extends TransactionReceiptsComponent {
  override readonly itemService = inject(UnassociatedTransactionListService);

  override readonly columns: Signal<ColumnDefinition<TransactionListRecord>[]> = computed(() => [
    this.buildLineColumn(),
    this.buildTypeColumn(this.typeBodyTpl()),
    this.buildNameColumn(),
    this.buildDateColumn(),
    {
      field: 'memo_code',
      header: 'Memo',
      sortable: true,
      cssClass: 'memo-column',
      pipes: ['memoCode'],
    },
    this.buildAmountColumn(),
    this.buildTransactionIdColumn(),
    this.buildAssociatedWithColumn(),
    {
      field: '',
      header: 'Actions',
      cssClass: 'actions-column',
      bodyTpl: this.actionsBodyTpl(),
    },
  ]);
}
