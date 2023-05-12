import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Transaction } from 'app/shared/models/transaction.model';
import { Destroyer } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent extends Destroyer {
  transaction: Transaction | undefined;

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private titleService: Title) {
    super();
    activatedRoute.data.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.transaction = data['transaction'];
      if (this.transaction) {
        const title: string = this.transaction.transactionType?.title || '';
        this.titleService.setTitle(title);
      }
    });
  }
}
