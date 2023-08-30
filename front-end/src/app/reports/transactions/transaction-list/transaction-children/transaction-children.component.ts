import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { Store } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';

@Component({
  selector: 'app-transaction-receipts',
  templateUrl: './transaction-children.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionChildrenComponent extends TransactionListTableBaseComponent implements OnInit {
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
  }
}
