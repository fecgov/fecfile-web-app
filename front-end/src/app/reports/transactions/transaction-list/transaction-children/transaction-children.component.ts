import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { Store } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';
import { Transaction } from 'app/shared/models/transaction.model';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';

@Component({
  selector: 'app-transaction-children',
  templateUrl: './transaction-children.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionChildrenComponent extends TransactionListTableBaseComponent implements OnInit {
  @Input() transactions: Transaction[] = [];
  @Input() tableLabel = 'children';
  // eslint-disable-next-line @typescript-eslint/ban-types
  scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleATransactionTypeLabels,
    ...ScheduleBTransactionTypeLabels,
    ...ScheduleCTransactionTypeLabels,
    ...ScheduleDTransactionTypeLabels,
    ...ScheduleETransactionTypeLabels,
  ];

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

  // The transactionFilter can be overriden to ensure that
  // the table only displays transactions meeting certain criteria
  public transactionFilter(transaction: Transaction): boolean {
    return !!transaction;
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.transactions = this.transactions.filter((transaction: Transaction) => {
      if (this.transactionFilter) {
        return this.transactionFilter?.(transaction);
      } else {
        return true;
      }
    });
  }
}
