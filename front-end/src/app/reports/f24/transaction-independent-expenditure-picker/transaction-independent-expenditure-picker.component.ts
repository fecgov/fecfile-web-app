import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ScheduleETransactionTypeLabels, ScheduleETransactionTypes } from 'app/shared/models/sche-transaction.model';
import { Card } from 'primeng/card';
import { LabelPipe } from '../../../shared/pipes/label.pipe';
import { Disbursement } from 'app/shared/models/transaction-group';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';

@Component({
  selector: 'app-transaction-independent-expenditure-picker',
  templateUrl: './transaction-independent-expenditure-picker.component.html',
  styleUrls: ['./transaction-independent-expenditure-picker.component.scss'],
  imports: [Card, RouterLink, LabelPipe],
})
export class TransactionIndependentExpenditurePickerComponent {
  private readonly store = inject(Store);
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

  readonly report = this.store.selectSignal(selectActiveReport);
  readonly title = 'Add an independent expenditure';

  readonly pageDataCy = buildDataCy('transactions', 'independent-expenditure', 'picker', 'page');
  readonly titleDataCy = buildDataCy('transactions', 'independent-expenditure', 'picker', 'title');
  readonly panelDataCy = buildDataCy('transactions', 'independent-expenditure', 'picker', 'panel');

  getRouterLink(transactionType: string): string | undefined {
    return `/reports/transactions/report/${this.report().id}/create/${transactionType}`;
  }

  transactionLinkDataCy(transactionType: string): string {
    const label = this.transactionTypeLabels.find(([value]) => value === transactionType)?.[1] ?? transactionType;
    return buildDataCy('transactions', 'independent-expenditure', 'picker', label, 'link');
  }
}
