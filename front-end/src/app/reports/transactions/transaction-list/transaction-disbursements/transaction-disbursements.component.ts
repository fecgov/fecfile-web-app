import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TransactionSchBService } from 'app/shared/services/transaction-schB.service';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { DateUtils } from 'app/shared/utils/date.utils';
import { ReportTypes } from 'app/shared/models/report.model';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { CurrencyPipe } from '@angular/common';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
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
export class TransactionDisbursementsComponent extends TransactionListTableBaseComponent implements OnInit {
  protected override readonly itemService = inject(TransactionSchBService);
  readonly scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleBTransactionTypeLabels,
    ...ScheduleETransactionTypeLabels,
  ];
  readonly form24ReportType = ReportTypes.F24;
  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Transaction ID, Associated with, and Actions.';

  @Input() openReportSelectionDialog = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _transaction: Transaction,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _formType: ReportTypes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _createMethod: () => void,
  ) => {
    return;
  };

  constructor() {
    super();
    this.sortableHeaders.push(
      ...[
        { field: 'date', label: 'Date' },
        { field: 'memo_code', label: 'Memo' },
        { field: 'amount', label: 'Amount' },
      ],
    );
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.rowActions.push(
      new TableAction(
        'Add to Form24 Report',
        (transaction) => {
          this.openReportSelectionDialog(transaction as Transaction, ReportTypes.F24, this.refreshTable.bind(this));
        },
        (transaction) => {
          return (
            this.report?.report_type === ReportTypes.F3X &&
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
