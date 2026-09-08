import { Component } from '@angular/core';
import { UnassociatedTransactionReceiptsComponent } from './unassociated-transaction-receipts/unassociated-transaction-receipts.component';
import { UnassociatedTransactionDisbursementsComponent } from './unassociated-transaction-disbursements/unassociated-transaction-disbursements.component';
import { UnassociatedTransactionLoansAndDebtsComponent } from './unassociated-transaction-loans-and-debts/unassociated-transaction-loans-and-debts.component';
import { Toolbar } from 'primeng/toolbar';
import { TabsModule } from 'primeng/tabs';
import { PrimeTemplate } from 'primeng/api';
import { TransactionListComponent } from 'app/reports/transactions/transaction-list/transaction-list.component';

@Component({
  selector: 'app-unassociated-transactions-list',
  templateUrl: './unassociated-transaction-list.component.html',
  styleUrls: ['../reports/transactions/transaction.scss', './unassociated-transaction-list.component.scss'],
  imports: [
    Toolbar,
    PrimeTemplate,
    TabsModule,
    UnassociatedTransactionReceiptsComponent,
    UnassociatedTransactionDisbursementsComponent,
    UnassociatedTransactionLoansAndDebtsComponent,
  ],
})
export class UnassociatedTransactionListComponent extends TransactionListComponent {}
