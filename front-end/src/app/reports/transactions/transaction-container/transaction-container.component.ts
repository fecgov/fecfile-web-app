import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Transaction, isPulledForwardLoan } from 'app/shared/models/transaction.model';
import { takeUntil } from 'rxjs';
import { NavigationEvent } from '../../../shared/models/transaction-navigation-controls.model';
import { ReportService } from '../../../shared/services/report.service';
import { ReattRedesTypes, ReattRedesUtils } from '../../../shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from '../../../store/active-report.selectors';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
  styleUrls: ['./transaction-container.component.scss'],
})
export class TransactionContainerComponent extends DestroyerComponent implements OnInit {
  transaction: Transaction | undefined;
  transactionCardinality = 1;
  isEditableReport = true;
  isEditableTransaction = true;
  navigationEvent?: NavigationEvent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private titleService: Title,
    private reportService: ReportService,
  ) {
    super();
  }

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
        this.transactionCardinality = this.getTransactionCardinality();
        const title: string = this.transaction.transactionType?.title ?? '';
        this.titleService.setTitle(title);
      } else {
        throw new Error('Fecfile: No transaction found in TransactionContainerComponent');
      }
    });

    this.isEditableTransaction = !ReattRedesUtils.isCopyFromPreviousReport(this.transaction);
  }

  getTransactionCardinality(): number {
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
