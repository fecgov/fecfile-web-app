import { Component, forwardRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CurrencyPipe } from '@angular/common';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
import { MemoCodePipe } from '../transaction-list.component';

@Component({
  selector: 'app-transaction-receipts',
  templateUrl: './transaction-receipts.component.html',
  styleUrls: ['../../transaction.scss'],
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

  constructor() {
    super();
    this.sortableHeaders.push(
      ...[
        { field: 'date', label: 'Date' },
        { field: 'memo_code', label: 'Memo' },
        { field: 'amount', label: 'Amount' },
        { field: 'aggregate', label: 'Aggregate' },
      ],
    );
  }
}
