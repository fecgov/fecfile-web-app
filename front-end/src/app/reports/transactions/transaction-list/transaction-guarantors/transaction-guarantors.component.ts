import { ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { LabelList } from 'app/shared/utils/label.utils';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionSchC2Service } from 'app/shared/services/transaction-schC2.service';
import { Transaction } from 'app/shared/models/transaction.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: './transaction-guarantors.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionGuarantorsComponent extends TransactionListTableBaseComponent implements OnInit {
  scheduleTransactionTypeLabels: LabelList = ScheduleC2TransactionTypeLabels;
  @Input() loan?: Transaction;

  override sortableHeaders: { field: string; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'amount', label: 'Guaranteed financial information amount' },
  ];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override activatedRoute: ActivatedRoute,
    protected override router: Router,
    protected override itemService: TransactionSchC2Service,
    protected override store: Store,
    protected override reportService: ReportService,
    private cdr: ChangeDetectorRef,
  ) {
    super(messageService, confirmationService, elementRef, activatedRoute, router, store, reportService);
  }

  override getParams(): QueryParams {
    if (this.loan?.id) {
      return { ...super.getParams(), parent: this.loan.id };
    }
    return super.getParams();
  }
  override loadTableItems(event: TableLazyLoadEvent): void {
    if (!this.loan?.id) {
      this.items = [];
      this.totalItems = 0;
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      super.loadTableItems(event);
    }
  }

  override rowActions: TableAction[] = [
    new TableAction(
      'View',
      this.editItem.bind(this),
      () => !this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      () => this.reportIsEditable,
      () => true,
    ),
  ];
}
