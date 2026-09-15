import { Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { BaseTransactionListComponent } from '../../transaction-list/base-transaction-list.component';
import { TransactionListTableComponent } from '../../transaction-list/transaction-list-table/transaction-list-table.component';

@Component({
  selector: 'app-unassigned-transactions-list',
  templateUrl: './unassigned-transaction-list.component.html',
  styleUrls: ['../../transaction.scss', '../../transaction-list/transaction-list.component.scss'],
  imports: [Toolbar, PrimeTemplate, TabsModule, TransactionListTableComponent],
})
export class UnassignedTransactionListComponent extends BaseTransactionListComponent {}
