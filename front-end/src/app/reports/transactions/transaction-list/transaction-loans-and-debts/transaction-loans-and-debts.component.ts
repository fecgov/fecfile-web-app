import { Component, computed, inject, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { ScheduleC1TransactionTypeLabels } from 'app/shared/models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { TableBodyContext, TableComponent } from '../../../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';

@Component({
  selector: 'app-transaction-loans-and-debts',
  templateUrl: './transaction-loans-and-debts.component.html',
  styleUrls: ['../../transaction.scss', './transaction-loans-and-debts.component.scss'],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
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

  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('typeBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('actionsBody');

  readonly columns = computed(() => [
    this.buildLineColumn(),
    this.buildTypeColumn(this.typeBodyTpl()),
    this.buildNameColumn(),
    this.buildDateColumn({
      header: 'Incurred',
      cssClass: 'incurred-column',
    }),
    this.buildAmountColumn(),
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
