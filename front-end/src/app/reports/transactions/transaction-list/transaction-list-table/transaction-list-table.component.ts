import { Component, computed, inject, input, output, TemplateRef, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { TableBodyContext, TableComponent } from 'app/shared/components/table/table.component';
import { Report, ReportTypes } from 'app/shared/models/reports/report.model';
import type { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { QueryParams } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { TRANSACTION_CATEGORY_CONFIG, TransactionCategory } from './transaction-category.config';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { TransactionColumnFactory } from './transaction-column.factory';
import { TransactionListService } from 'app/shared/services/transaction-list.service';
import { BaseTransactionActionsFactory } from './transaction-actions';

@Component({
  selector: 'app-transaction-list-table',
  templateUrl: './transaction-list-table.component.html',
  styleUrls: ['../../transaction.scss'],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
  providers: [TransactionColumnFactory, BreakpointStore],
})
export class TransactionListTableComponent extends TableListBaseComponent<TransactionListRecord> {
  protected readonly itemService = inject(TransactionListService);
  protected readonly router = inject(Router);
  protected readonly store = inject(Store);
  protected readonly activatedRoute = inject(ActivatedRoute);
  readonly reportService = inject(ReportService);
  private readonly actionsFactory = inject(BaseTransactionActionsFactory);
  private readonly columnFactory = inject(TransactionColumnFactory);

  readonly report = input.required<Report | null>();
  readonly category = input.required<TransactionCategory>();

  readonly config = computed(() => TRANSACTION_CATEGORY_CONFIG[this.category()]);
  readonly unassigned = computed(() => this.report() === null);

  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('typeBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('actionsBody');

  readonly paginationPageSizeOptions = [5, 10, 15, 20];
  readonly reportIsEditable = computed(() => this.reportService.isEditable(this.report()));
  readonly isForm24 = computed(() => this.report()?.form_type === ReportTypes.F24);

  readonly rowActions = computed(() =>
    this.actionsFactory.buildActions({
      category: this.category(),
      report: this.report(),
      reloadTable: this.loadTableItems.bind(this),
      deleteItem: this.deleteItem.bind(this),
      onRequestF24Selection: (transaction) => {
        this.requestReportSelection.emit({
          transaction,
          formType: ReportTypes.F24,
          createMethod: () => this.refreshTable(),
        });
      },
    }),
  );

  readonly columns = computed(() =>
    this.columnFactory.buildColumns(this.category(), this.config(), this.typeBodyTpl(), this.actionsBodyTpl()),
  );

  readonly requestReportSelection = output<{
    transaction: TransactionListRecord;
    formType: ReportTypes;
    createMethod: () => Promise<void>;
  }>();

  constructor() {
    super();
    this.rowsPerPage.set(5);
  }

  public onTableActionClick(action: TableAction<Report>, report: Report) {
    action.action(report);
  }

  protected getEmptyItem(): TransactionListRecord {
    return {} as TransactionListRecord;
  }

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage(), schedules: this.config().schedules };
    const report = this.report();
    if (report) {
      params['report_id'] = report.id ?? '';
      params['report_type'] = report.report_type;
      params['report_code_label'] = report.report_code_label ?? '';
    }

    return params;
  });

  selectF24Report(transaction: TransactionListRecord) {
    this.requestReportSelection.emit({
      transaction,
      formType: ReportTypes.F24,
      createMethod: this.refreshTable.bind(this),
    });
  }

  override deleteItem(item: TransactionListRecord): void | Promise<void> {
    this.confirmationService.confirm({
      message:
        'Deleting this transaction will also delete any linked transactions ' +
        '(such as memos, in-kinds, and transfers). Please note that you cannot undo this action.',
      accept: () => {
        this.itemService.delete(item).then(() => {
          this.item = this.getEmptyItem();
          this.refreshAllTables();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Transaction Deleted',
          });
        });
      },
    });
  }
}
