import { ChangeDetectorRef, Component, computed, inject, input, Signal, TemplateRef, viewChild } from '@angular/core';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { LabelList } from 'app/shared/utils/label.utils';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { TransactionSchC2Service } from 'app/shared/services/transaction-schC2.service';
import { Transaction } from 'app/shared/models/transaction.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';
import {
  ColumnDefinition,
  TableBodyContext,
  TableComponent,
} from '../../../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { CurrencyPipe } from '@angular/common';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: './transaction-guarantors.component.html',
  styleUrls: ['../../transaction.scss'],
  imports: [TableComponent, TableActionsButtonComponent, CurrencyPipe, ConfirmDialog],
})
export class TransactionGuarantorsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchC2Service);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleC2TransactionTypeLabels;

  readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('nameBody');
  readonly amountBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('amountBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Transaction>>>('actionsBody');

  readonly loan = input<Transaction>();

  readonly columns: Signal<ColumnDefinition<Transaction>[]> = computed(() => [
    {
      field: 'name',
      header: 'Name',
      sortable: true,
      cssClass: 'name-column',
      bodyTpl: this.nameBodyTpl(),
    },
    {
      field: 'amount',
      header: 'Guaranteed financial information amount',
      sortable: true,
      cssClass: 'amount-column',
      bodyTpl: this.amountBodyTpl(),
    },
    {
      field: '',
      header: 'Actions',
      cssClass: 'actions-column',
      bodyTpl: this.actionsBodyTpl(),
    },
  ]);

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage() };
    if (this.loan()?.id) {
      params['parent'] = this.loan()?.id ?? '';
    }
    return params;
  });

  override async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    if (!this.loan()?.id) {
      this.items.set([]);
      this.totalItems.set(0);
      this.loading = false;
      this.cdr.detectChanges();
    } else {
      await super.loadTableItems(event);
    }
  }

  override rowActions: TableAction<Transaction>[] = [
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

  public override refreshAllTables() {
    this.refreshTable();
  }
}
