import { Component, ElementRef, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-transaction-disbursements',
  templateUrl: './transaction-disbursements.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionDisbursementsComponent extends TransactionListTableBaseComponent implements OnInit {
  scheduleTransactionTypeLabels: LabelList = [...ScheduleBTransactionTypeLabels, ...ScheduleETransactionTypeLabels];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected override itemService: TransactionSchBService,
    protected override store: Store,
    protected override reportService: ReportService
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute, router, store, reportService);
    this.caption =
      'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Transaction ID, Associated with, and Actions.';
  }

  public convertToDate(date: string) {
    return DateUtils.convertFecFormatToDate(date) ?? undefined;
  }
}
