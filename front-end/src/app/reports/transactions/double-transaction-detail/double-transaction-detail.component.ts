import { Component } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/double-transaction-type-base.component';

@Component({
  selector: 'app-double-transaction-detail',
  templateUrl: './double-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './double-transaction-detail.component.scss'],
})
export class DoubleTransactionDetailComponent extends DoubleTransactionTypeBaseComponent {}
