import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Transaction, isPulledForwardLoan } from 'app/shared/models/transaction.model';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { ReattRedesTypes } from 'app/shared/models/reattribution-redesignation/reattribution-redesignation-base.model';
import { ReattRedesUtils } from 'app/shared/utils/reatt-redes.utils';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent extends DestroyerComponent {
  transaction: Transaction | undefined;

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private titleService: Title) {
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
    if (isPulledForwardLoan(this.transaction)) {
      return 1;
    }
    if (
      this.activatedRoute.snapshot.queryParamMap.get('reattribution') ||
      ReattRedesUtils.isReattRedes(this.transaction, [
        ReattRedesTypes.REATTRIBUTION_TO,
        ReattRedesTypes.REDESIGNATION_TO,
      ])
    ) {
      return 2;
    }
    return (this.transaction?.transactionType?.dependentChildTransactionTypes?.length ?? 0) + 1;
  }
}
