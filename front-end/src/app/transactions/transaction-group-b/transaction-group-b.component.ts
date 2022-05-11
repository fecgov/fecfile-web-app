import { Component, OnInit, Input } from '@angular/core';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';

@Component({
  selector: 'app-transaction-group-b',
  templateUrl: './transaction-group-b.component.html',
  styleUrls: ['./transaction-group-b.component.scss'],
})
export class TransactionGroupBComponent implements OnInit {
  @Input() schema: JsonSchema | null = null;
  @Input() transaction: Transaction | null = null;

  constructor() {}

  ngOnInit(): void {
    console.log('schema', this.schema);
    console.log('txn', this.transaction);
  }
}
