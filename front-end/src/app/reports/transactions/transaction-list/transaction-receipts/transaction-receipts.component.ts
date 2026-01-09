import { Component, computed, forwardRef, inject, Signal, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import {
  ColumnDefinition,
  TableBodyContext,
  TableComponent,
} from '../../../../shared/components/table/table.component';
import { CurrencyPipe } from '@angular/common';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { Transaction } from 'app/shared/models';

@Component({
  selector: 'app-transaction-receipts',
  templateUrl: './transaction-receipts.component.html',
  styleUrls: ['../../transaction.scss', './transaction-receipts.component.scss'],
  imports: [
    TableComponent,
    RouterLink,
    TableActionsButtonComponent,
    CurrencyPipe,
    FecDatePipe,
    LabelPipe,
    forwardRef(() => MemoCodePipe),
  ],
})
export class TransactionReceiptsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchAService);
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels;
  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Aggregate, Transaction ID, Associated with, and Actions.';

  readonly lineLabelBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('lineLabelBody');
  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('typeBody');
  readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('nameBody');
  readonly dateBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('dateBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('actionsBody');

  readonly columns = computed(() => [
    this.buildLineColumn(this.lineLabelBodyTpl()),
    this.buildTypeColumn(this.typeBodyTpl()),
    this.buildNameColumn({ bodyTpl: this.nameBodyTpl() }),
    {
      field: 'date',
      header: 'Date',
      sortable: true,
      cssClass: 'date-column',
      bodyTpl: this.dateBodyTpl(),
    },
    {
      field: 'memo_code',
      header: 'Memo',
      sortable: true,
      cssClass: 'memo-column',
      pipe: 'memoCode',
    },
    {
      field: 'amount',
      header: 'Amount',
      sortable: true,
      cssClass: 'amount-column',
      pipe: 'currency',
    },
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
