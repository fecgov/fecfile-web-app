import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DoubleTransactionGroup } from 'app/shared/models/transaction-groups/double-transaction-group.interface';
import { TransactionGroup } from 'app/shared/models/transaction-groups/transaction-group.interface';
import { Transaction } from 'app/shared/models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { CommitteeAccount } from '../../shared/models/committee-account.model';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount: CommitteeAccount) => {
        if (this.transaction) {
          this.transaction.filer_committee_id_number = committeeAccount.committee_id ?? 'C00000000';
        }
        if (this.transaction?.transactionType?.dependentChildTransactionType && this.transaction.children) {
          this.transaction.children[0].filer_committee_id_number = committeeAccount.committee_id ?? 'C00000000';
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
