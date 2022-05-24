import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TransactionMeta } from 'app/shared/interfaces/transaction-meta.interface';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';
import { CommitteeAccount } from '../../shared/models/committee-account.model';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent implements OnInit, OnDestroy {
  meta: TransactionMeta = this.activatedRoute.snapshot.data['transactionMeta'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount: CommitteeAccount) => {
        if (this.meta.transaction) {
          this.meta.transaction.filer_committee_id_number = committeeAccount.committee_id;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
