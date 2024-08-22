import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Report } from 'app/shared/models/report.model';
import {
  ScheduleETransactionGroups,
  ScheduleETransactionTypeLabels,
  ScheduleETransactionTypes,
} from 'app/shared/models/sche-transaction.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-transaction-independent-expenditure-picker',
  templateUrl: './transaction-independent-expenditure-picker.component.html',
  styleUrls: ['./transaction-independent-expenditure-picker.component.scss'],
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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {
    super();
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
  }
}
