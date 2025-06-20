import { ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { LabelList } from 'app/shared/utils/label.utils';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { TransactionSchC2Service } from 'app/shared/services/transaction-schC2.service';
import { Transaction } from 'app/shared/models/transaction.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: './transaction-guarantors.component.html',
  styleUrls: ['../../transaction.scss'],
  imports: [TableComponent, TableActionsButtonComponent, CurrencyPipe],
})
export class TransactionGuarantorsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchC2Service);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleC2TransactionTypeLabels;

  @Input() loan?: Transaction;

  override sortableHeaders: { field: string; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'amount', label: 'Guaranteed financial information amount' },
  ];

  override getParams(): QueryParams {
    if (this.loan?.id) {
      return { ...super.getParams(), parent: this.loan.id };
    }
    return super.getParams();
  }
  override async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    if (!this.loan?.id) {
      this.items = [];
      this.totalItems = 0;
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      await super.loadTableItems(event);
    }
  }

  override rowActions: TableAction[] = [
    new TableAction(
      'View',
      this.editItem.bind(this),
      () => !this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      () => this.reportIsEditable(),
      () => true,
    ),
  ];
}
