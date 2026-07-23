import { Component, computed, effect, inject, input, signal, Signal, TemplateRef, viewChild } from '@angular/core';
import { ColumnDefinition, TableBodyContext, TableComponent } from '../../table/table.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { ScheduleFTransactionTypeLabels } from 'app/shared/models/schf-transaction.model';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { QueryParams } from 'app/shared/services/api.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { TransactionListService } from 'app/shared/services/transaction-list.service';
import { Contact } from 'app/shared/models/contact.model';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypeLabels } from 'app/shared/models/schc-transaction.model';
import { ScheduleC1TransactionTypeLabels } from 'app/shared/models/schc1-transaction.model';
import { ScheduleC2TransactionTypeLabels } from 'app/shared/models/schc2-transaction.model';
import { ScheduleDTransactionTypeLabels } from 'app/shared/models/schd-transaction.model';
import { ScheduleETransactionTypeLabels } from 'app/shared/models/sche-transaction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-transaction-table',
  imports: [TableComponent, CurrencyPipe, DatePipe, LabelPipe],
  template: `<ng-template #typeBody let-transaction>
      <a (click)="openTransaction(transaction)">
        {{ transaction.transaction_type_identifier | label: scheduleTransactionTypeLabels }}
      </a>
    </ng-template>
    <ng-template #dateBody let-transaction>{{ transaction.date | date: 'MM/dd/yyyy' }}</ng-template>
    <ng-template #amountBody let-transaction>{{ transaction.amount | currency }}</ng-template>

    <app-table
      [(first)]="first"
      title="Transaction history"
      [(sortField)]="sortField"
      [items]="transactions"
      [(totalItems)]="totalTransactions"
      [columns]="columns()"
      [loading]="tableLoading"
      [(rowsPerPage)]="rowsPerPage"
      itemName="transactions"
      [emptyMessage]="emptyMessage"
    />`,
  styleUrl: './contact-transaction-table.component.scss',
})
export class ContactTransactionTableComponent {
  private readonly transactionService = inject(TransactionListService);
  public readonly router = inject(Router);

  readonly contact = input<Contact>();
  readonly first = signal(0);
  readonly sortField = signal('transaction_type_identifier');
  readonly sortOrder = signal<'asc' | 'desc'>('asc');

  transactions: TransactionListRecord[] = [];
  tableLoading = true;
  readonly totalTransactions = signal(0);
  readonly rowsPerPage = signal(5);
  readonly params: Signal<QueryParams | undefined> = computed(() => {
    const contact = this.contact()?.id;
    if (!contact) return undefined;
    return { page_size: this.rowsPerPage(), contact };
  });
  readonly scheduleTransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels.concat(
    ScheduleBTransactionTypeLabels,
    ScheduleCTransactionTypeLabels,
    ScheduleC1TransactionTypeLabels,
    ScheduleC2TransactionTypeLabels,
    ScheduleDTransactionTypeLabels,
    ScheduleETransactionTypeLabels,
    ScheduleFTransactionTypeLabels,
  );

  emptyMessage = 'No data available in table';

  readonly typeBodyTpl = viewChild<TemplateRef<TableBodyContext<TransactionListRecord>>>('typeBody');
  readonly dateBodyTpl = viewChild<TemplateRef<TableBodyContext<TransactionListRecord>>>('dateBody');
  readonly amountBodyTpl = viewChild<TemplateRef<TableBodyContext<TransactionListRecord>>>('amountBody');
  readonly columns: Signal<ColumnDefinition<TransactionListRecord>[]> = computed(() => {
    const type = this.typeBodyTpl();
    const date = this.dateBodyTpl();
    const amount = this.amountBodyTpl();
    if (!type || !date || !amount) return [];
    return [
      {
        field: 'transaction_type_identifier',
        header: 'Type',
        sortable: true,
        cssClass: 'type-column',
        bodyTpl: type,
      },
      { field: 'report_type', header: 'Form', sortable: true, cssClass: 'form-column' },
      { field: 'report_code_label', header: 'Report', sortable: true, cssClass: 'report-column' },
      {
        field: 'date',
        header: 'Date',
        sortable: true,
        cssClass: 'date-column',
        bodyTpl: date,
      },
      {
        field: 'amount',
        header: 'Amount',
        sortable: true,
        cssClass: 'amount-column',
        bodyTpl: amount,
      },
    ];
  });

  readonly table = viewChild(TableComponent);
  constructor() {
    effect(() => {
      this.rowsPerPage();
      this.first.set(0);
    });

    effect(() => {
      this.sortField();
      this.sortOrder();
      this.first();
      this.rowsPerPage();
      this.loadTransactions();
    });
  }

  async loadTransactions() {
    const params = this.params();
    if (!params) return;
    this.tableLoading = true;

    // event is undefined when triggered from the detail page because
    // the detail doesn't know what page we are on. We check the local
    // pagerState variable to retrieve the page state.

    const sortField = this.sortField();
    const sortOrder = this.sortOrder() === 'asc' ? 1 : -1;
    const first = this.first();
    const rows = this.rowsPerPage();
    const pageNumber: number = Math.floor(first / rows) + 1;

    // Determine query sort ordering
    let ordering: string | string[] = sortField ?? 'transaction_type_identifier';
    if (ordering && sortOrder === -1) {
      ordering = `-${ordering}`;
    } else {
      ordering = `${ordering}`;
    }

    try {
      const transactionsPage = await this.transactionService.getTableData(pageNumber, ordering, this.params());
      this.transactions = transactionsPage.results;
      this.totalTransactions.set(transactionsPage.count);
      this.tableLoading = false;
      this.emptyMessage = 'No data available in table';
    } catch {
      this.tableLoading = false;
      this.emptyMessage = 'Error loading transactions for contact';
    }
  }

  openTransaction(transactionListRecord: TransactionListRecord) {
    if (transactionListRecord.report_ids?.length) {
      return this.router.navigate([
        `reports/transactions/report/${transactionListRecord.report_ids[0]}/list/${transactionListRecord.id}`,
      ]);
    }
    return Promise.resolve(false);
  }
}
