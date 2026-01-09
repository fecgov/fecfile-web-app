import { Component, computed, inject, Signal, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { ScheduleC1TransactionTypeLabels } from 'app/shared/models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import {
  ColumnDefinition,
  TableBodyContext,
  TableComponent,
} from '../../../../shared/components/table/table.component';
import { CurrencyPipe } from '@angular/common';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
import { Transaction } from 'app/shared/models';

@Component({
  selector: 'app-transaction-loans-and-debts',
  templateUrl: './transaction-loans-and-debts.component.html',
  styleUrls: ['../../transaction.scss', './transaction-loans-and-debts.component.scss'],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, CurrencyPipe, FecDatePipe, LabelPipe],
})
export class TransactionLoansAndDebtsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchCService);
  readonly scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleCTransactionTypeLabels,
    ...ScheduleC1TransactionTypeLabels,
    ...ScheduleC2TransactionTypeLabels,
    ...ScheduleDTransactionTypeLabels,
  ];

  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date incurred, Amount, Balance, Transaction ID, Associated with, and Actions.';

  readonly lineLabelBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('lineLabelBody');
  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('typeBody');
  readonly dateBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('dateBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('actionsBody');

  readonly columns = computed(() => [
    this.buildLineColumn(this.lineLabelBodyTpl()),
    this.buildTypeColumn(this.typeBodyTpl()),
    this.buildNameColumn(),
    {
      field: 'incurred',
      header: 'Incurred',
      sortable: true,
      cssClass: 'incurred-column',
      bodyTpl: this.dateBodyTpl(),
    },
    {
      field: 'amount',
      header: 'Amount',
      sortable: true,
      cssClass: 'amount-column',
      pipe: 'currency',
    },
    {
      field: 'balance',
      header: 'Balance',
      sortable: true,
      cssClass: 'balance-column',
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
