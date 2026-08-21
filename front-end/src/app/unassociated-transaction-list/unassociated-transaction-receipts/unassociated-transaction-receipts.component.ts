import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';
import { TransactionReceiptsComponent } from 'app/reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { LabelPipe } from 'app/shared/pipes/label.pipe';

@Component({
  selector: 'app-unassociated-transaction-receipts',
  templateUrl: '../../reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component.html',
  styleUrls: [
    '../../reports/transactions/transaction.scss',
    '../../reports/transactions/transaction-list/transaction-receipts/transaction-receipts.component.scss',
  ],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
})
export class UnassociatedTransactionReceiptsComponent extends TransactionReceiptsComponent {
  override readonly itemService = inject(UnassociatedTransactionListService);
}
