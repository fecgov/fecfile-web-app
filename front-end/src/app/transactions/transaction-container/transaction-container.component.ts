import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionMeta } from 'app/shared/interfaces/transaction-meta.interface';

@Component({
  selector: 'app-transaction-container',
  templateUrl: './transaction-container.component.html',
})
export class TransactionContainerComponent {
  meta: TransactionMeta = this.activatedRoute.snapshot.data['transactionMeta'];

  constructor(private activatedRoute: ActivatedRoute) {}
}
