/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Component,
  TemplateRef,
  output,
  contentChild,
  viewChild,
  computed,
  input,
  model,
  HostBinding,
} from '@angular/core';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';
import { CurrencyPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { PrimeTemplate, SortEvent } from 'primeng/api';
import { Select } from 'primeng/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableSortIconComponent } from '../table-sort-icon/table-sort-icon.component';
import { Toolbar } from 'primeng/toolbar';
import { TableAction } from '../table-actions-button/table-actions';
import { DynamicPipe } from 'app/shared/pipes/dynamic.pipe';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { TransactionIdPipe } from 'app/shared/pipes/transaction-id.pipe';
import { DefaultZeroPipe } from 'app/shared/pipes/default-zero.pipe';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';

export interface ColumnDefinition<T> {
  field: string;
  header: string;
  cssClass?: string;
  sortable?: boolean;
  bodyTpl?: TemplateRef<TableBodyContext<T>>;
  actions?: TableAction<T>[];
  checkbox?: boolean;
  label?: (item: T) => string;
  pipes?: string[];
  pipeArgs?: any[];
}

export interface TableBodyContext<T> {
  $implicit: T;
  rowActions?: TableAction<T>[];
  rowIndex?: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    NgTemplateOutlet,
    TableModule,
    PrimeTemplate,
    Select,
    ReactiveFormsModule,
    FormsModule,
    Paginator,
    TableSortIconComponent,
    NgClass,
    Toolbar,
    DynamicPipe,
  ],
  providers: [CurrencyPipe, MemoCodePipe, FecDatePipe, TransactionIdPipe, DefaultZeroPipe],
})
export class TableComponent<T> {
  readonly dataCyContext = input('');
  readonly title = input.required<string>();
  readonly itemName = input('entries');
  readonly items = input.required<T[]>();
  readonly globalFilterFields = input(['']);
  readonly totalItems = model.required<number>();
  readonly loading = input.required<boolean>();
  readonly rowsPerPage = model.required<number>();
  readonly selectedItems = model<T[]>([]);
  readonly currentPageReportTemplate = input('Showing {first} to {last} of {totalRecords} items');
  readonly sortField = model.required<string>();
  readonly sortOrder = model<string>('asc');
  readonly columns = input<ColumnDefinition<T>[]>([]);
  readonly emptyMessage = input('No data available in table');

  @HostBinding('attr.title')
  readonly hostTitle = null;

  readonly pageChange = output<PageTransitionEvent>();

  readonly paginationPageSizeOptions = [5, 10, 15, 20];

  readonly dt = viewChild.required<Table>('dt');

  readonly caption = contentChild<TemplateRef<HTMLElement>>('caption');
  readonly header = contentChild<TemplateRef<TableBodyContext<T>>>('header');
  readonly body = contentChild<TemplateRef<TableBodyContext<T>>>('body');

  readonly showing = computed(() => {
    return `Showing ${this.from()} to ${this.to()} of ${this.totalItems()} ${this.itemName()}`;
  });

  readonly from = computed(() => (this.totalItems() === 0 ? 0 : this.first() + 1));
  readonly to = computed(() => Math.min(this.first() + this.rowsPerPage(), this.totalItems()));

  readonly first = model.required<number>();

  readonly showPaginationControls = input(true);
  readonly tableDataCy = computed(() => buildDataCy(this.dataCyContext(), 'table'));
  readonly titleDataCy = computed(() => buildDataCy(this.dataCyContext(), 'table', 'title'));
  readonly emptyStateDataCy = computed(() => buildDataCy(this.dataCyContext(), 'table', 'empty-state'));
  readonly resultsPerPageDataCy = computed(() =>
    buildDataCy(this.dataCyContext(), 'table', 'pagination', 'rows-per-page'),
  );
  readonly paginatorDataCy = computed(() => buildDataCy(this.dataCyContext(), 'table', 'pagination'));
  readonly paginationRowsSelectPt = computed(() => ({
    root: { 'data-cy': this.resultsPerPageDataCy() },
    label: { 'data-cy': buildDataCy(this.resultsPerPageDataCy(), 'label') },
    dropdown: { 'data-cy': buildDataCy(this.resultsPerPageDataCy(), 'dropdown') },
    listContainer: { 'data-cy': buildDataCy(this.resultsPerPageDataCy(), 'options') },
    option: { 'data-cy': buildDataCy(this.resultsPerPageDataCy(), 'option') },
  }));
  readonly paginatorPt = computed(() => ({
    root: { 'data-cy': this.paginatorDataCy() },
    current: { 'data-cy': buildDataCy(this.paginatorDataCy(), 'current') },
    first: { 'data-cy': buildDataCy(this.paginatorDataCy(), 'first-button') },
    prev: { 'data-cy': buildDataCy(this.paginatorDataCy(), 'previous-button') },
    next: { 'data-cy': buildDataCy(this.paginatorDataCy(), 'next-button') },
    last: { 'data-cy': buildDataCy(this.paginatorDataCy(), 'last-button') },
    pcRowPerPageDropdown: this.paginationRowsSelectPt(),
  }));

  changePage(value: PaginatorState) {
    this.first.set(value.first ?? 0);
  }

  updateSort(event: SortEvent) {
    this.sortField.set(event.field || '');
    this.sortOrder.set(event.order === 1 ? 'asc' : 'desc');
  }

  columnDataCy(column: ColumnDefinition<T>) {
    return buildDataCy(this.dataCyContext(), 'table', column.field || column.header, 'column');
  }

  rowDataCy(item: T, rowIndex: number) {
    if (item && typeof item === 'object' && 'id' in (item as Record<string, unknown>)) {
      const id = (item as Record<string, unknown>)['id'];
      if (typeof id === 'string' || typeof id === 'number') {
        return buildDataCy(this.dataCyContext(), 'table', 'row', id);
      }
    }

    return buildDataCy(this.dataCyContext(), 'table', 'row', rowIndex);
  }
}
