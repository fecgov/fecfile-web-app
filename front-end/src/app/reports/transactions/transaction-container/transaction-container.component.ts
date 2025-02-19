import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { isPulledForwardLoan, Transaction } from 'app/shared/models/transaction.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
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
export class TransactionContainerComponent extends DestroyerComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly titleService = inject(Title);
  private readonly reportService = inject(ReportService);
  transaction: Transaction | undefined;
  isEditableReport = true;
  isEditableTransaction = true;

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.isEditableReport = this.reportService.isEditable(report);
      });

    this.activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.transaction = data['transaction'];
      if (this.transaction) {
        const title: string = this.transaction.transactionType?.title ?? '';
        this.titleService.setTitle(title);
      } else {
        throw new Error('Fecfile: No transaction found in TransactionContainerComponent');
      }
    });

    this.isEditableTransaction = !ReattRedesUtils.isCopyFromPreviousReport(this.transaction);
  }

  transactionCardinality(): number {
    if (
      ReattRedesUtils.isReattRedes(this.transaction) &&
      !(
        ReattRedesUtils.isReattRedes(this.transaction, [ReattRedesTypes.REATTRIBUTED, ReattRedesTypes.REDESIGNATED]) &&
        this.transaction?.id
      )
    )
      return -1;
    if (isPulledForwardLoan(this.transaction)) {
      return 1;
    }
    return (this.transaction?.transactionType?.dependentChildTransactionTypes?.length ?? 0) + 1;
  }
}
