import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';

@Component({
  selector: 'app-transaction-receipts',
  templateUrl: './transaction-receipts.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionReceiptsComponent extends TransactionListTableBaseComponent implements OnInit {
  scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected override itemService: TransactionSchAService,
    protected override store: Store,
    protected override reportService: ReportService
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute, router, store, reportService);
    this.caption = "Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, Aggregate, Transaction ID, Associated with, and Actions.";
  }
}
