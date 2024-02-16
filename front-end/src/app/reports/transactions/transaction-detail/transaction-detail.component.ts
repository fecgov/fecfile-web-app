import { Component } from '@angular/core';
import { TransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/transaction-type-base.component';
import {isDebtRepayment} from "../../../shared/models/transaction.model";

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionDetailComponent extends TransactionTypeBaseComponent {
  protected readonly isDebtRepayment = isDebtRepayment;
}
