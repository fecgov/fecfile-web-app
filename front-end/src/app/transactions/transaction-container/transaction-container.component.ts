import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TransactionType } from '../../shared/models/transaction-types/transaction-type.model';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';
import { CommitteeAccount } from '../../shared/models/committee-account.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent implements OnInit, OnDestroy {
  transactionType: TransactionType | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private titleService: Title) {
    activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.transactionType = data['transactionType'];
      if (this.transactionType) {
        const title = this.transactionType['title'];
        this.titleService.setTitle(title);
      }
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount: CommitteeAccount) => {
        if (this.transactionType?.transaction) {
          this.transactionType.transaction.filer_committee_id_number = committeeAccount.committee_id;
        }
        if (this.transactionType?.childTransactionType?.transaction) {
          this.transactionType.childTransactionType.transaction.filer_committee_id_number =
            committeeAccount.committee_id;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
