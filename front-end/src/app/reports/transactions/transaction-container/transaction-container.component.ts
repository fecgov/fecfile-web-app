import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { isPulledForwardLoan, Transaction } from 'app/shared/models/transaction.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { ReattRedesUtils } from '../../../shared/utils/reatt-redes/reatt-redes.utils';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent extends DestroyerComponent {
  transaction: Transaction | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private titleService: Title,
  ) {
    super();
    activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.transaction = data['transaction'];
      if (this.transaction) {
        const title: string = this.transaction.transactionType?.title ?? '';
        this.titleService.setTitle(title);
      } else {
        throw new Error('Fecfile: No transaction found in TransactionContainerComponent');
      }
    });
  }

  transactionCardinality(): number {
    if (ReattRedesUtils.isReattRedes(this.transaction)) return -1;
    if (isPulledForwardLoan(this.transaction)) {
      return 1;
    }
    return (this.transaction?.transactionType?.dependentChildTransactionTypes?.length ?? 0) + 1;
  }
}
