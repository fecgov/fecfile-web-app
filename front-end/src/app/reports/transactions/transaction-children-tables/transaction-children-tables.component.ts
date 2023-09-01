import { Component, Input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-transaction-children-tables',
  templateUrl: 'transaction-children-tables.component.html',
  styleUrls: ['../transaction.scss'],
})
export class TransactionChildrenTablesComponent {
  @Input() transaction?: Transaction;
}
