import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { ScheduleC1TransactionTypeLabels } from 'app/shared/models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CurrencyPipe } from '@angular/common';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';

@Component({
  selector: 'app-transaction-loans-and-debts',
  templateUrl: './transaction-loans-and-debts.component.html',
  styleUrls: ['../../transaction.scss'],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, CurrencyPipe, FecDatePipe, LabelPipe],
})
export class TransactionLoansAndDebtsComponent extends TransactionListTableBaseComponent implements OnInit {
  protected override readonly itemService = inject(TransactionSchCService);
  readonly scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleCTransactionTypeLabels,
    ...ScheduleC1TransactionTypeLabels,
    ...ScheduleC2TransactionTypeLabels,
    ...ScheduleDTransactionTypeLabels,
  ];

  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date incurred, Amount, Balance, Transaction ID, Associated with, and Actions.';

  constructor() {
    super();
    this.sortableHeaders.push(
      ...[
        { field: 'date', label: 'Incurred' },
        { field: 'amount', label: 'Amount' },
        { field: 'balance', label: 'Balance' },
      ],
    );
  }
}
