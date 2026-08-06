import { Component, computed, effect, inject, Signal, linkedSignal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { isPulledForwardLoan, Transaction } from 'app/shared/models/transaction.model';
import {  ReattRedesUtils } from '../../../shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { ReportService } from '../../../shared/services/report.service';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { DoubleTransactionDetailComponent } from '../double-transaction-detail/double-transaction-detail.component';
import { TripleTransactionDetailComponent } from '../triple-transaction-detail/triple-transaction-detail.component';
import { ReattRedesTransactionTypeDetailComponent } from '../reatt-redes-transaction-type-detail/reatt-redes-transaction-type-detail.component';
import { TransactionChildrenListContainerComponent } from '../transaction-children-list-container/transaction-children-list-container.component';
import { TransactionNavigationComponent } from '../transaction-navigation/transaction-navigation.component';
import { injectRouteData } from 'ngxtension/inject-route-data';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { ButtonDirective } from 'primeng/button';
import { ReattRedesTypes } from 'app/shared/utils/reatt-redes/reatt-redes.types';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
  styleUrls: ['./transaction-container.component.scss'],
  imports: [
    TransactionDetailComponent,
    DoubleTransactionDetailComponent,
    TripleTransactionDetailComponent,
    ReattRedesTransactionTypeDetailComponent,
    TransactionChildrenListContainerComponent,
    TransactionNavigationComponent,
    DialogComponent,
    ButtonDirective,
  ],
})
export class TransactionContainerComponent {
  private readonly store = inject(Store);
  private readonly titleService = inject(Title);
  private readonly reportService = inject(ReportService);
  readonly report = this.store.selectSignal(selectActiveReport);
  readonly isEditableReport = computed(() => this.reportService.isEditable(this.report()));
  private readonly cloneParam = injectQueryParams('clone');
  readonly showClonedTransactionDialog = linkedSignal(() => !!this.cloneParam());

  private readonly _transaction: Signal<Transaction | null> = injectRouteData('transaction');
  readonly transaction = computed(() => this._transaction() ?? undefined);
  readonly isEditableTransaction = computed(() => !ReattRedesUtils.isCopyFromPreviousReport(this.transaction()));

  readonly transactionCardinality = computed(() => {
    const transaction = this.transaction();
    if (
      ReattRedesUtils.isReattRedes(transaction) &&
      !(
        ReattRedesUtils.isReattRedes(transaction, [ReattRedesTypes.REATTRIBUTED, ReattRedesTypes.REDESIGNATED]) &&
        transaction?.id
      )
    )
      return -1;
    if (isPulledForwardLoan(transaction)) {
      return 1;
    }
    return (transaction?.transactionType?.dependentChildTransactionTypes?.length ?? 0) + 1;
  });

  constructor() {
    effect(() => this.titleService.setTitle(this.transaction()?.transactionType?.title ?? ''));
  }
}
