import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DoubleTransactionGroup } from 'app/shared/models/transaction-groups/double-transaction-group.interface';
import { TransactionGroup } from 'app/shared/models/transaction-groups/transaction-group.interface';
import { Transaction } from 'app/shared/models/transaction.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent implements OnDestroy {
  transaction: Transaction | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private titleService: Title) {
    activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.transaction = data['transaction'];
      if (this.transaction) {
        const title: string = this.transaction.transactionType?.title || '';
        this.titleService.setTitle(title);
      }
    });
  }

  isTransactionGroup() {
    return this.transaction?.transactionType?.transactionGroup instanceof TransactionGroup;
  }

  isDoubleTransactionGroup() {
    return this.transaction?.transactionType?.transactionGroup instanceof DoubleTransactionGroup;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
