import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { LabelPipe } from '../../shared/pipes/label.pipe';
import { TransactionLoansAndDebtsComponent } from 'app/reports/transactions/transaction-list/transaction-loans-and-debts/transaction-loans-and-debts.component';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';

@Component({
  selector: 'app-unassociated-transaction-loans-and-debts',
  templateUrl:
    '../../reports/transactions/transaction-list/transaction-loans-and-debts/transaction-loans-and-debts.component.html',
  styleUrls: [
    '../../reports/transactions/transaction.scss',
    '../../reports/transactions/transaction-list/transaction-loans-and-debts/transaction-loans-and-debts.component.scss',
  ],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
})
export class UnassociatedTransactionLoansAndDebtsComponent extends TransactionLoansAndDebtsComponent {
  override readonly itemService = inject(UnassociatedTransactionListService);
}
