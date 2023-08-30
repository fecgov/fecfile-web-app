import { Component, OnInit } from '@angular/core';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { TransactionChildrenComponent } from '../transaction-children/transaction-children.component';

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: '../transaction-children/transaction-children.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionGuarantorComponent extends TransactionChildrenComponent implements OnInit {
  override tableLabel = 'Guarantors';

  public override transactionFilter(transaction: Transaction): boolean {
    return transaction.transaction_type_identifier === ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO;
  }
}
