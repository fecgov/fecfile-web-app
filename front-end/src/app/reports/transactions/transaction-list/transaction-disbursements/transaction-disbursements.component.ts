import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionSchBService } from 'app/shared/services/transaction-schB.service';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { Store } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { ReportTypes } from 'app/shared/models/report.model';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-transaction-disbursements',
  templateUrl: './transaction-disbursements.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionDisbursementsComponent extends TransactionListTableBaseComponent implements OnInit {
  @Input() openReportSelectionDialog = (
    _transaction: Transaction,
    _formType: ReportTypes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onCreate: () => void,
  ) => {
    return;
  };
  form24ReportType = ReportTypes.F24;

  scheduleTransactionTypeLabels: LabelList = [...ScheduleBTransactionTypeLabels, ...ScheduleETransactionTypeLabels];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected override itemService: TransactionSchBService,
    protected override store: Store,
    protected override reportService: ReportService,
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute, router, store, reportService);
    this.caption =
      'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Transaction ID, Associated with, and Actions.';
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
          return this.report?.report_type === ReportTypes.F3X && transaction.report_ids?.length === 1;
        },
        () => true,
      ),
    );
  }

  public convertToDate(date: string) {
    return DateUtils.convertFecFormatToDate(date) ?? undefined;
  }
}
