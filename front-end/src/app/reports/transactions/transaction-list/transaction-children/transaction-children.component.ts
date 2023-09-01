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
  @Input() transactions?: Transaction[];
  @Input() tableLabel = 'Children';
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

    this.transactions = this.transactions?.filter((transaction: Transaction) => {
      if (this.transactionFilter) {
        return this.transactionFilter?.(transaction);
      } else {
        return true;
      }
    });
  }

  override onRowsPerPageChange(): void {
    return;
  }

  override editItem(item: Transaction) {
    this.router.navigateByUrl(`reports/transactions/report/${item.report_id}/list/${item.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortMethod(event$: any) {
    let transactions = (event$.data ?? []) as Transaction[];
    if (event$.field === 'name') {
      transactions = transactions.sort((a, b) => {
        const nameA = a.contact_1?.name ?? `${a.contact_1?.last_name}, ${a.contact_1?.first_name}`;
        const nameB = b.contact_1?.name ?? `${b.contact_1?.last_name}, ${b.contact_1?.first_name}`;
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (event$.field === 'amount') {
      transactions = transactions.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (a as any).amount - (b as any).amount;
      });
    }

    if (event$.order === -1) {
      transactions = transactions.reverse();
    }

    //Modify the event data in place in order to alter the sorting.
    event$.data = transactions;
  }
}
