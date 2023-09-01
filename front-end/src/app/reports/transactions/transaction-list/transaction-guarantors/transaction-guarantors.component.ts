import { Component, OnInit } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import { TransactionChildrenComponent } from '../transaction-children/transaction-children.component';
import { ScheduleC2TransactionTypes } from 'app/shared/models/schc2-transaction.model';

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: '../transaction-children/transaction-children.component.html',
  styleUrls: ['../../transaction.scss'],
})
export class TransactionGuarantorsComponent extends TransactionChildrenComponent implements OnInit {
  override tableLabel = 'Guarantors';
  override amountHeader = 'Guaranteed financial information amount';

  public override transactionFilter(transaction: Transaction): boolean {
    return transaction.transaction_type_identifier === ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR;
  }
}
