import { Component, Input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import { TransactionGuarantorsComponent } from '../transaction-list/transaction-guarantors/transaction-guarantors.component';

@Component({
  selector: 'app-transaction-children-list-container',
  templateUrl: 'transaction-children-list-container.component.html',
  styleUrls: ['../transaction.scss'],
  imports: [TransactionGuarantorsComponent],
})
export class TransactionChildrenListContainerComponent {
  @Input() transaction?: Transaction;
}
