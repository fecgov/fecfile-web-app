import { Component, computed, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ColumnDefinition, TableBodyContext } from 'app/shared/components/table/table.component';
import {
  isPulledForwardLoan,
  Report,
  ReportTypes,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
  ScheduleC1TransactionTypes,
  ScheduleCTransactionTypes,
  ScheduleDTransactionTypes,
  ScheduleIds,
} from 'app/shared/models';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { QueryParams } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { UnassociatedTransactionListService } from 'app/shared/services/transaction-list-unassociated.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ReattRedesTypes, ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { TransactionListTableBaseComponent } from '../reports/transactions/transaction-list/transaction-list-table-base.component';

const loanReceipts = ['LOAN_RECEIVED_FROM_BANK_RECEIPT', 'LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT', 'LOAN_MADE'];
const loansDebts = [
  'LOAN_RECEIVED_FROM_INDIVIDUAL',
  'LOAN_RECEIVED_FROM_BANK',
  'LOAN_BY_COMMITTEE',
  'DEBT_OWED_BY_COMMITTEE',
  'DEBT_OWED_TO_COMMITTEE',
];

@Component({
  template: '',
})
export abstract class UnassociatedTransactionListTableBaseComponent extends TransactionListTableBaseComponent {
  protected readonly unassociatedTransactionService = inject(UnassociatedTransactionListService);

  public override rowActions: TableAction<TransactionListRecord>[] = [];

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage() };
    return params;
  });
}
