import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';
import { CommitteeAccount } from '../../shared/models/committee-account.model';
import { Title } from '@angular/platform-browser';
import { Transaction } from 'app/shared/models/transaction.model';

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
