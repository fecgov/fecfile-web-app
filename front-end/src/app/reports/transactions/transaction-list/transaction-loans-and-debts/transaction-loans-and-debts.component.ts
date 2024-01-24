import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionSchCService } from 'app/shared/services/transaction-schC.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { Store } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';
import { ScheduleC1TransactionTypeLabels } from 'app/shared/models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';

@Component({
  selector: 'app-transaction-loans-and-debts',
  templateUrl: './transaction-loans-and-debts.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionLoansAndDebtsComponent extends TransactionListTableBaseComponent implements OnInit {
  scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleCTransactionTypeLabels,
    ...ScheduleC1TransactionTypeLabels,
    ...ScheduleC2TransactionTypeLabels,
    ...ScheduleDTransactionTypeLabels,
  ];

  sortableHeaders = [
    {field: "line_label_order_key", label: "Line"},
    {field: "transaction_type_identifier", label: "Type"},
    {field: "name", label: "Name"},
    {field: "date", label: "Date incurred"},
    {field: "transaction_table_amount", label: "Amount"},
    {field: "balance", label: "Balance"}
  ];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected override itemService: TransactionSchCService,
    protected override store: Store,
    protected override reportService: ReportService
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute, router, store, reportService);
    this.caption = "Data table of all reports created by the committee broken down by Line, Type, Name, Date incurred, Amount, Balance, Transaction ID, Associated with, and Actions.";
  }
}
