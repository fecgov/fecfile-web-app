import { ChangeDetectorRef, Component, computed, inject, input, TemplateRef, viewChild } from '@angular/core';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { QueryParams } from 'app/shared/services/api.service';
import { TableBodyContext, TableComponent } from '../../../../shared/components/table/table.component';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { Transaction } from 'app/shared/models';
import { instanceToPlain } from 'class-transformer';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { TransactionListService } from 'app/shared/services/transaction-list.service';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportService } from 'app/shared/services/report.service';
import { BreakpointStore, ScreenSize } from 'app/store/breakpoint.store';

type GuarantorColumns = 'name' | 'amount' | 'actions';
type ColumnWidthMap = Record<GuarantorColumns, string>;
const COLUMN_WIDTH_CONFIG: Partial<Record<ScreenSize, ColumnWidthMap>> = {
  sm: {
    name: '50%',
    amount: '36%',
    actions: '14%',
  },
  md: {
    name: '50%',
    amount: '40%',
    actions: '10%',
  },
  lg: {
    name: '50%',
    amount: '39%',
    actions: '11%',
  },
  xl: {
    name: '48%',
    amount: '43.5%',
    actions: '8.5%',
  },
  xxl: {
    name: '50%',
    amount: '43.2%',
    actions: '6.8%',
  },
};

@Component({
  selector: 'app-transaction-guarantors',
  templateUrl: './transaction-guarantors.component.html',
  styleUrls: ['../../transaction.scss'],
  imports: [TableComponent, TableActionsButtonComponent, ConfirmDialog],
  providers: [BreakpointStore],
})
export class TransactionGuarantorsComponent extends TableListBaseComponent<TransactionListRecord> {
  protected override itemService = inject(TransactionListService);
  private readonly breakpointStore = inject(BreakpointStore);
  private readonly reportService = inject(ReportService);
  private readonly store = inject(Store);
  private readonly report = this.store.selectSignal(selectActiveReport);
  private readonly reportIsEditable = computed(() => this.reportService.isEditable(this.report()));
  private readonly cdr = inject(ChangeDetectorRef);
  readonly scheduleTransactionTypeLabels = ScheduleC2TransactionTypeLabels;

  private readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('nameBody');
  private readonly actionsBodyTpl =
    viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('actionsBody');

  readonly transaction = input<Transaction>();
  readonly loan = computed(() => {
    const transaction = this.transaction();
    const plain = instanceToPlain(transaction);
    return TransactionListRecord.fromJSON(plain);
  });

  protected readonly columns = computed(() => {
    const widths = this.breakpointStore.getColumnWidths(COLUMN_WIDTH_CONFIG);
    return [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
        cssClass: 'name-column',
        bodyTpl: this.nameBodyTpl(),
        width: widths.name,
      },
      {
        field: 'amount',
        header: 'Guaranteed financial information amount',
        sortable: true,
        cssClass: 'amount-column',
        pipes: ['currency'],
        width: widths.amount,
      },
      {
        field: '',
        header: 'Actions',
        cssClass: 'actions-column',
        bodyTpl: this.actionsBodyTpl(),
        width: widths.actions,
      },
    ];
  });

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage() };
    if (this.loan()?.id) params['parent'] = this.loan()?.id ?? '';
    params['schedules'] = 'C2';
    return params;
  });

  override async loadTableItems(): Promise<void> {
    if (!this.loan()?.id) {
      this.items.set([]);
      this.totalItems.set(0);
      this.loading.set(false);
      this.cdr.detectChanges();
    } else {
      await super.loadTableItems();
    }
  }

  readonly rowActions: TableAction<TransactionListRecord>[] = [
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

  protected override getEmptyItem(): TransactionListRecord {
    return {} as TransactionListRecord;
  }
}
