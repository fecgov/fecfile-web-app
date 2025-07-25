import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Report } from 'app/shared/models/report.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from 'app/shared/models/sche-transaction.model';
import { Card } from 'primeng/card';
import { LabelPipe } from '../../../shared/pipes/label.pipe';
import { Disbursement } from 'app/shared/models/transaction-group';

@Component({
  selector: 'app-transaction-independent-expenditure-picker',
  templateUrl: './transaction-independent-expenditure-picker.component.html',
  styleUrls: ['./transaction-independent-expenditure-picker.component.scss'],
  imports: [Card, RouterLink, LabelPipe],
})
export class TransactionIndependentExpenditurePickerComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly titleService = inject(Title);
  readonly transactionTypeLabels = ScheduleETransactionTypeLabels;
  readonly transactionGroups = Disbursement;
  readonly transactionTypes = [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID,
    ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
  ];

  report?: Report;
  readonly title = 'Add an independent expenditure';

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
