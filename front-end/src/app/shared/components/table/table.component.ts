/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, TemplateRef, contentChild, viewChild, input, model, HostBinding } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CurrencyPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { PrimeTemplate, SortEvent } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { TableAction } from '../table-actions-button/table-actions';
import { DynamicPipe } from 'app/shared/pipes/dynamic.pipe';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { TransactionIdPipe } from 'app/shared/pipes/transaction-id.pipe';
import { DefaultZeroPipe } from 'app/shared/pipes/default-zero.pipe';
import { SharedTableTemplates } from './shared-table.templates';

export interface ColumnDefinition<T> {
  field: string;
  header: string;
  cssClass?: string;
  width?: string;
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
  rowIndex?: number;
  rowActions?: TableAction<T>[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [NgTemplateOutlet, TableModule, PrimeTemplate, NgClass, Toolbar, DynamicPipe, SharedTableTemplates],
  providers: [CurrencyPipe, MemoCodePipe, FecDatePipe, TransactionIdPipe, DefaultZeroPipe],
})
export class TableComponent<T> {
  readonly title = input<string>();
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

  readonly paginationPageSizeOptions = [5, 10, 15, 20];

  readonly dt = viewChild.required<Table>('dt');

  readonly caption = contentChild<TemplateRef<HTMLElement>>('caption');
  readonly header = contentChild<TemplateRef<TableBodyContext<T>>>('header');
  readonly body = contentChild<TemplateRef<TableBodyContext<T>>>('body');

  readonly first = model.required<number>();

  readonly showPaginationControls = input(true);

  updateSort(event: SortEvent) {
    this.sortField.set(event.field || '');
    this.sortOrder.set(event.order === 1 ? 'asc' : 'desc');
  }
}
