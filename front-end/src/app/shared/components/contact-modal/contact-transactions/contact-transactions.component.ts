import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, Signal } from '@angular/core';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { TableComponent } from '../../table/table.component';
import { TableListBaseComponent } from '../../table-list-base/table-list-base.component';
import {
  ReportTypes,
  ScheduleATransactionTypeLabels,
  ScheduleBTransactionTypeLabels,
  ScheduleC1TransactionTypeLabels,
  ScheduleC2TransactionTypeLabels,
  ScheduleCTransactionTypeLabels,
  ScheduleDTransactionTypeLabels,
  ScheduleETransactionTypeLabels,
  Transaction,
} from 'app/shared/models';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { getReportFromJSON } from 'app/shared/services/report.service';
import { RouterLink } from '@angular/router';
import { QueryParams } from 'app/shared/services/api.service';

export class TransactionData {
  id: string;
  report_ids: string[];
  form_type = '';
  report_code_label = '';
  transaction_type_identifier: string;
  date: string;
  amount: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(transaction: any) {
    this.id = transaction.id;
    this.report_ids = transaction.report_ids;
    this.date = transaction.date;
    this.amount = transaction.amount;
    this.transaction_type_identifier = transaction.transaction_type_identifier;

    transaction.reports.forEach((r: JSON) => {
      const report = getReportFromJSON(r);
      if (report.report_type === ReportTypes.F24) return; // We will display the Form 3X version of the transaction #1977
      this.form_type = report.formLabel;
      this.report_code_label = report.report_code_label ?? '';
    });
  }
}

@Component({
  selector: 'app-contact-transactions',
  templateUrl: './contact-transactions.component.html',
  imports: [TableComponent, LabelPipe, DatePipe, CurrencyPipe, RouterLink],
})
export class ContactTransactionComponent extends TableListBaseComponent<Transaction> {
  protected override itemService = inject(TransactionService);

  readonly contactId = input.required<string>();

  override readonly params: Signal<QueryParams> = computed(() => {
    return { page_size: this.rowsPerPage(), contact: this.contactId() };
  });

  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels.concat(
    ScheduleBTransactionTypeLabels,
    ScheduleCTransactionTypeLabels,
    ScheduleC1TransactionTypeLabels,
    ScheduleC2TransactionTypeLabels,
    ScheduleDTransactionTypeLabels,
    ScheduleETransactionTypeLabels,
  );

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'transaction_type_identifier', label: 'Type' },
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Report' },
    { field: 'date', label: 'Date' },
    { field: 'amount', label: 'Amount' },
  ];

  protected override getEmptyItem(): Transaction {
    throw new Error('Method not implemented.');
  }
}
