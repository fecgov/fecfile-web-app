/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, TemplateRef, output, contentChild, viewChild, computed, input, model } from '@angular/core';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { TableLazyLoadEvent, Table, TableModule, TablePageEvent } from 'primeng/table';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Select } from 'primeng/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableSortIconComponent } from '../table-sort-icon/table-sort-icon.component';

export interface ColumnDefinition {
  field: string;
  header: string;
  cssClass?: string; // <-- Add this for your CSS
  sortable?: boolean;
  bodyTpl?: TemplateRef<any>; // <-- Add this for the custom cell template
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
  ],
})
export class TableComponent<T> {
  readonly title = input<string>();
  readonly itemName = input('entries');
  readonly items = input.required<T[]>();
  readonly globalFilterFields = input(['']);
  readonly totalItems = model.required<number>();
  readonly loading = input.required<boolean>();
  readonly rowsPerPage = model(5);
  readonly selectedItems = model<T[]>([]);
  readonly currentPageReportTemplate = input('Showing {first} to {last} of {totalRecords} items');
  readonly sortField = input.required<string>();
  // This can go away after full transition to ColumnDefinition method
  readonly sortableHeaders = input<{ field: string; label: string }[]>([]);
  readonly columns = input<ColumnDefinition[]>([]);
  readonly hasCheckbox = input(false);
  readonly checkboxLabel = input<(item: T) => string>();
  readonly emptyMessage = input('No data available in table');

  readonly loadTableItems = output<TableLazyLoadEvent>();
  readonly pageChange = output<PageTransitionEvent>();

  readonly paginationPageSizeOptions = [5, 10, 15, 20];

  readonly dt = viewChild.required<Table>('dt');

  readonly caption = contentChild<TemplateRef<any>>('caption');
  readonly header = contentChild<TemplateRef<any>>('header');
  readonly body = contentChild<TemplateRef<any>>('body');

  readonly showing = computed(() => {
    return `Showing ${this.from()} to ${this.to()} of ${this.totalItems()} ${this.itemName()}`;
  });

  readonly from = computed(() => (this.totalItems() === 0 ? 0 : this.first() + 1));
  readonly to = computed(() => Math.min(this.first() + this.rowsPerPage(), this.totalItems()));

  readonly first = model.required<number>();

  changePage(value: PaginatorState) {
    this.dt().onPageChange(value as TablePageEvent);
  }
}
