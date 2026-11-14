import { Component, computed, effect, inject, linkedSignal, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isPulledForwardLoan, Transaction } from 'app/shared/models/transaction.model';
import { ReattRedesTypes, ReattRedesUtils } from '../../../shared/utils/reatt-redes/reatt-redes.utils';
import { ReportService } from '../../../shared/services/report.service';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';
import { DoubleTransactionDetailComponent } from '../double-transaction-detail/double-transaction-detail.component';
import { TripleTransactionDetailComponent } from '../triple-transaction-detail/triple-transaction-detail.component';
import { ReattRedesTransactionTypeDetailComponent } from '../reatt-redes-transaction-type-detail/reatt-redes-transaction-type-detail.component';
import { TransactionChildrenListContainerComponent } from '../transaction-children-list-container/transaction-children-list-container.component';
import { TransactionNavigationComponent } from '../transaction-navigation/transaction-navigation.component';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { ButtonDirective } from 'primeng/button';

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
  private readonly titleService = inject(Title);
  private readonly reportService = inject(ReportService);
  readonly report = input<Report>();
  readonly isEditableReport = computed(() => this.reportService.isEditable(this.report()));
  readonly clone = input<string>();
  readonly showClonedTransactionDialog = linkedSignal(() => !!this.clone());

  readonly transaction = input<Transaction>();
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
