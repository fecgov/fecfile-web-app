import { Component, Input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-transaction-children-list-container',
  templateUrl: 'transaction-children-list-container.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionChildrenListContainerComponent {
  @Input() transaction?: Transaction;
}
