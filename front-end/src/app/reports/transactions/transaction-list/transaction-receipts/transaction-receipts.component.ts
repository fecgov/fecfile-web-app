import { Component, computed, inject, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { TableBodyContext, TableComponent } from '../../../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';

@Component({
  selector: 'app-transaction-receipts',
  templateUrl: './transaction-receipts.component.html',
  styleUrls: ['../../transaction.scss', './transaction-receipts.component.scss'],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
})
export class TransactionReceiptsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchAService);
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels;
  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Aggregate, Transaction ID, Associated with, and Actions.';

  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('typeBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('actionsBody');

  readonly columns = computed(() => [
    this.buildLineColumn(),
    this.buildTypeColumn(this.typeBodyTpl()),
    this.buildNameColumn(),
    this.buildDateColumn(),
    {
      field: 'memo_code',
      header: 'Memo',
      sortable: true,
      cssClass: 'memo-column',
      pipe: 'memoCode',
    },
    this.buildAmountColumn(),
    {
      field: 'aggregate',
      header: 'Aggregate',
      sortable: true,
      cssClass: 'aggregate-column',
      pipe: 'currency',
    },
    {
      field: '',
      header: 'Actions',
      cssClass: 'actions-column',
      bodyTpl: this.actionsBodyTpl(),
    },
  ]);
}
