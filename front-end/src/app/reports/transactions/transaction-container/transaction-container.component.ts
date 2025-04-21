import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { isPulledForwardLoan, Transaction } from 'app/shared/models/transaction.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../../shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { ReportService } from '../../../shared/services/report.service';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { DoubleTransactionDetailComponent } from '../double-transaction-detail/double-transaction-detail.component';
import { TripleTransactionDetailComponent } from '../triple-transaction-detail/triple-transaction-detail.component';
import { ReattRedesTransactionTypeDetailComponent } from '../reatt-redes-transaction-type-detail/reatt-redes-transaction-type-detail.component';
import { TransactionChildrenListContainerComponent } from '../transaction-children-list-container/transaction-children-list-container.component';
import { TransactionNavigationComponent } from '../transaction-navigation/transaction-navigation.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { toSignal } from '@angular/core/rxjs-interop';

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
    ConfirmDialog,
  ],
})
export class TransactionContainerComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly titleService = inject(Title);
  private readonly reportService = inject(ReportService);

  readonly report = this.store.selectSignal(selectActiveReport);
  readonly isEditableReport = computed(() => this.reportService.isEditable(this.report()));

  readonly routeData = toSignal(this.activatedRoute.data);
  readonly transaction = computed(() => {
    const data = this.routeData();
    if (!data) return undefined;
    return data['transaction'] as Transaction;
  });
  readonly isEditableTransaction = computed(() => !ReattRedesUtils.isCopyFromPreviousReport(this.transaction()));

  readonly transactionCardinality = computed(() => {
    if (
      ReattRedesUtils.isReattRedes(this.transaction()) &&
      !(
        ReattRedesUtils.isReattRedes(this.transaction(), [
          ReattRedesTypes.REATTRIBUTED,
          ReattRedesTypes.REDESIGNATED,
        ]) && this.transaction()?.id
      )
    )
      return -1;
    if (isPulledForwardLoan(this.transaction())) {
      return 1;
    }
    return (this.transaction()?.transactionType?.dependentChildTransactionTypes?.length ?? 0) + 1;
  });

  constructor() {
    effect(() => {
      if (!this.routeData()) return;
      const transaction = this.transaction();
      if (!transaction) {
        throw new Error('Fecfile: No transaction found in TransactionContainerComponent');
      }
      const title: string = transaction.transactionType?.title ?? '';
      this.titleService.setTitle(title);
    });
  }
}
