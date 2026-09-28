import { Component } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { TransactionListComponent } from 'app/reports/transactions/transaction-list/transaction-list.component';
import { TransactionDisbursementsComponent } from 'app/reports/transactions/transaction-list/transaction-disbursements/transaction-disbursements.component';
import { TransactionLoansAndDebtsComponent } from 'app/reports/transactions/transaction-list/transaction-loans-and-debts/transaction-loans-and-debts.component';
import { TransactionReceiptsComponent } from 'app/reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component';

@Component({
  selector: 'app-unassigned-transactions-list',
  templateUrl: './unassigned-transaction-list.component.html',
  styleUrls: ['../reports/transactions/transaction.scss', './unassigned-transaction-list.component.scss'],
  imports: [
    Toolbar,
    PrimeTemplate,
    TabsModule,
    TransactionReceiptsComponent,
    TransactionDisbursementsComponent,
    TransactionLoansAndDebtsComponent,
  ],
})
export class UnassignedTransactionListComponent extends TransactionListComponent {}
