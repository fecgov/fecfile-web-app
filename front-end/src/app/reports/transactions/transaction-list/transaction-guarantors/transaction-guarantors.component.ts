import { Component, ElementRef, OnInit } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import { TransactionChildrenComponent } from '../transaction-children-list-table-base.component';
import { ScheduleC2TransactionTypes } from 'app/shared/models/schc2-transaction.model';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { TransactionListComponent } from '../transaction-list.component';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { LabelList, LineIdentifierLabels } from 'app/shared/utils/label.utils';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { TransactionSchC2Service } from 'app/shared/services/transaction-schC2.service';

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: './transaction-guarantors.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionGuarantorsComponent extends TransactionListTableBaseComponent implements OnInit {
  scheduleTransactionTypeLabels: LabelList = ScheduleC2TransactionTypeLabels;
  lineLabels = LineIdentifierLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected override itemService: TransactionSchC2Service,
    protected override store: Store,
    protected override reportService: ReportService
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute, router, store, reportService);
  }

  override rowActions: TableAction[] = [
    new TableAction(
      'View',
      this.editItem.bind(this),
      () => !this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      () => this.reportIsEditable,
      () => true
    ),
  ];
}
