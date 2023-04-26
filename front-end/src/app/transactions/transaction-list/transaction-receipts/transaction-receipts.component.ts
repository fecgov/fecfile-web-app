import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
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
    protected override itemService: TransactionSchAService
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute);
  }
}
