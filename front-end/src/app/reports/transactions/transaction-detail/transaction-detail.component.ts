import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import { isDebtRepayment } from '../../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent implements OnChanges {
  isDebtRepaymentFlag?: boolean;

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['transaction'] && this.transaction) {
      this.isDebtRepaymentFlag = isDebtRepayment(this.transaction);
    }
  }
}
