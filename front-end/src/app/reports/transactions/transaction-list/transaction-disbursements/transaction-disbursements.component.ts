import { CurrencyPipe } from '@angular/common';
import { Component, forwardRef, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { ReportTypes } from 'app/shared/models/report.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypeLabels } from 'app/shared/models/schf-transaction.model';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { TransactionSchBService } from 'app/shared/services/transaction-schB.service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { LabelList } from 'app/shared/utils/label.utils';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { MemoCodePipe } from '../transaction-list.component';

@Component({
  selector: 'app-transaction-disbursements',
  templateUrl: './transaction-disbursements.component.html',
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
export class TransactionDisbursementsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchBService);
  readonly scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleBTransactionTypeLabels,
    ...ScheduleETransactionTypeLabels,
    ...ScheduleFTransactionTypeLabels,
  ];
  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Transaction ID, Associated with, and Actions.';

  readonly requestReportSelection = output<{
    transaction: Transaction;
    formType: ReportTypes;
    createMethod: () => Promise<void>;
  }>();

  constructor() {
    super();
    this.sortableHeaders.push(
      ...[
        { field: 'date', label: 'Date' },
        { field: 'memo_code', label: 'Memo' },
        { field: 'amount', label: 'Amount' },
      ],
    );

    this.rowActions.push(
      new TableAction(
        'Add to Form24 Report',
        (transaction) => {
          this.requestReportSelection.emit({
            transaction: transaction as Transaction,
            formType: ReportTypes.F24,
            createMethod: this.refreshTable.bind(this),
          });
        },
        (transaction) => {
          return (
            this.report().report_type === ReportTypes.F3X &&
            transaction.report_ids?.length === 1 &&
            transaction.transactionType?.scheduleId === ScheduleIds.E
          );
        },
        () => true,
      ),
    );
  }

  public convertToDate(date: string) {
    return DateUtils.convertFecFormatToDate(date) ?? undefined;
  }
}
