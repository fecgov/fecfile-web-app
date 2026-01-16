import { Component, computed, inject, output, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { ScheduleFTransactionTypeLabels } from 'app/shared/models/schf-transaction.model';
import { ScheduleIds } from 'app/shared/models/transaction.model';
import { TransactionSchBService } from 'app/shared/services/transaction-schB.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TableActionsButtonComponent } from '../../../../shared/components/table-actions-button/table-actions-button.component';
import { TableBodyContext, TableComponent } from '../../../../shared/components/table/table.component';
import { LabelPipe } from '../../../../shared/pipes/label.pipe';
import { TransactionListTableBaseComponent } from '../transaction-list-table-base.component';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';

@Component({
  selector: 'app-transaction-disbursements',
  templateUrl: './transaction-disbursements.component.html',
  styleUrls: ['../../transaction.scss', './transaction-disbursements.component.scss'],
  imports: [TableComponent, RouterLink, TableActionsButtonComponent, LabelPipe],
})
export class TransactionDisbursementsComponent extends TransactionListTableBaseComponent {
  override readonly itemService = inject(TransactionSchBService);
  readonly scheduleTransactionTypeLabels: LabelList = [
    ...ScheduleBTransactionTypeLabels,
    ...ScheduleETransactionTypeLabels,
    ...ScheduleFTransactionTypeLabels,
  ];
  override readonly caption =
    'Data table of all reports created by the committee broken down by Line, Type, Name, Date, Memo, Amount, and Actions.';

  readonly requestReportSelection = output<{
    transaction: TransactionListRecord;
    formType: ReportTypes;
    createMethod: () => Promise<void>;
  }>();

  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('typeBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<TransactionListRecord>>>('actionsBody');

  readonly columns = computed(() => [
    this.buildLineColumn(),
    this.buildTypeColumn(this.typeBodyTpl()),
    this.buildNameColumn(),
    this.buildDateColumn(),
    {
      field: 'memo_code',
      header: 'Memo',
      sortable: true,
      cssClass: 'memo-column',
      pipe: 'memoCode',
    },
    this.buildAmountColumn(),
    {
      field: '',
      header: 'Actions',
      cssClass: 'actions-column',
      bodyTpl: this.actionsBodyTpl(),
    },
  ]);

  constructor() {
    super();
    this.rowActions.push(
      new TableAction(
        'Add to Form24 Report',
        (transaction) => {
          this.requestReportSelection.emit({
            transaction: transaction as TransactionListRecord,
            formType: ReportTypes.F24,
            createMethod: this.refreshTable.bind(this),
          });
        },
        (transaction) => {
          return (
            this.report().report_type === ReportTypes.F3X &&
            transaction.report_ids?.length === 1 &&
            transaction.transactionType?.scheduleId === ScheduleIds.E
          );
        },
        () => true,
      ),
    );
  }
}
