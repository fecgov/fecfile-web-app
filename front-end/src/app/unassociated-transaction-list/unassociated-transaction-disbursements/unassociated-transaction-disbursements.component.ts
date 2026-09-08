import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { LabelPipe } from '../../shared/pipes/label.pipe';
import { TransactionDisbursementsComponent } from 'app/reports/transactions/transaction-list/transaction-disbursements/transaction-disbursements.component';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';

@Component({
  selector: 'app-unassociated-transaction-disbursements',
  templateUrl:
    '../../reports/transactions/transaction-list/transaction-disbursements/transaction-disbursements.component.html',
  styleUrls: [
    '../../reports/transactions/transaction.scss',
    '../../reports/transactions/transaction-list/transaction-disbursements/transaction-disbursements.component.scss',
  ],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
})
export class UnassociatedTransactionDisbursementsComponent extends TransactionDisbursementsComponent {
  override readonly itemService = inject(UnassociatedTransactionListService);
}
