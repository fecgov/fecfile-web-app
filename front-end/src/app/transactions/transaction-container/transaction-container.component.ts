import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TransactionType } from '../../shared/interfaces/transaction-type.interface';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';
import { CommitteeAccount } from '../../shared/models/committee-account.model';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent implements OnInit, OnDestroy {
  transactionType: TransactionType = this.activatedRoute.snapshot.data['transactionType'];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount: CommitteeAccount) => {
        if (this.transactionType.transaction) {
          this.transactionType.transaction.filer_committee_id_number = committeeAccount.committee_id;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
