import { Component, TemplateRef, input, output, viewChild, contentChild, computed, model } from '@angular/core';
import { PaginatorState, Paginator } from 'primeng/paginator';
import { TableLazyLoadEvent, TableSelectAllChangeEvent, Table, TableModule } from 'primeng/table';
import { NgTemplateOutlet } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { Select } from 'primeng/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableSortIconComponent } from '../table-sort-icon/table-sort-icon.component';

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
  ],
})
export class TableComponent<T> {
  readonly title = input<string>();
  readonly itemName = input('entries');
  readonly items = input<T[]>([]);
  readonly globalFilterFields = input(['']);
  readonly totalItems = model(0);
  readonly loading = input(false);
  readonly rowsPerPage = model(5);
  readonly selectAll = input(false);
  readonly selectedItems = input<T[]>([]);
  readonly currentPageReportTemplate = input('Showing {first} to {last} of {totalRecords} items');
  readonly sortField = input('');
  readonly sortableHeaders = input<{ field: string; label: string }[]>([]);
  readonly hasCheckbox = input(false);
  readonly checkboxLabel = input<(item: T) => string>();
  readonly emptyMessage = input('No data available in table');

  readonly loadTableItems = output<TableLazyLoadEvent>();
  readonly selectionChange = output<T[]>();
  readonly selectAllChange = output<TableSelectAllChangeEvent>();
  readonly rowsPerPageChange = output<number>();
  readonly pageChange = output<PageTransitionEvent>();

  paginationPageSizeOptions = [5, 10, 15, 20];

  readonly dt = viewChild<Table>('dt');

  readonly toolbar = contentChild<TemplateRef<any>>('tooldbar');
  readonly caption = contentChild<TemplateRef<any>>('caption');
  readonly header = contentChild<TemplateRef<any>>('header');
  readonly body = contentChild<TemplateRef<any>>('body');

  readonly showing = computed(() => {
    const dt = this.dt();
    if (!dt) return 'No data available in table';
    const from = this.totalItems() === 0 ? 0 : this.first + 1;
    let to = this.first;
    if (dt.rows) to += dt.rows;
    const total = dt.totalRecords ?? 0;
    if (to > total) to = total;
    return `Showing ${from} to ${to} of ${total} ${this.itemName()}`;
  });

  get first(): number {
    return this.dt()?.first ?? 0;
  }

  set first(first: number) {
    this.dt()!.first = first;
  }

  changePage(value: PaginatorState) {
    this.dt()!.onPageChange({ first: value.first ?? 0, rows: value.rows ?? 0 });
  }
}
