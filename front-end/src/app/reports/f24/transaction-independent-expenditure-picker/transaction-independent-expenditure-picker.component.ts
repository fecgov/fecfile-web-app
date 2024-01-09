import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Report } from 'app/shared/models/report.model';
import { TransactionTypes, TransactionGroupTypes } from 'app/shared/models/transaction.model';
import { TransactionTypeUtils, getTransactionTypeClass } from 'app/shared/utils/transaction-type.utils';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import {
  ScheduleETransactionGroups,
  ScheduleETransactionTypeLabels,
  ScheduleETransactionTypes,
} from 'app/shared/models/sche-transaction.model';

type Categories = 'receipt' | 'disbursement' | 'loans-and-debts';

@Component({
  selector: 'app-transaction-independent-expenditure-picker',
  templateUrl: './transaction-independent-expenditure-picker.component.html',
})
export class TransactionIndependentExpenditurePickerComponent extends DestroyerComponent implements OnInit {
  transactionTypeLabels = ScheduleETransactionTypeLabels;
  transactionGroups = ScheduleETransactionGroups;
  transactionTypes = [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID,
    ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
  ];

  report?: Report;
  title = 'Add an independent expenditure';

  constructor(private store: Store, private route: ActivatedRoute, private titleService: Title) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
  }

  getRouterLink(transactionType: string): string | undefined {
    return `/reports/transactions/report/${this.report?.id}/create/${transactionType}`;
  }
}
