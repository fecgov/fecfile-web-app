import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  OnInit,
  OnChanges,
  AfterContentChecked,
  model,
} from '@angular/core';
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
export class TableComponent<T> implements OnInit, AfterContentChecked, OnChanges {
  @Input() title?: string;
  @Input() itemName = 'entries';
  @Input() items: T[] = [];
  @Input() globalFilterFields = [''];
  @Input() totalItems = 0;
  @Input() loading = false;
  readonly rowsPerPage = model.required<number>();
  @Input() selectAll = false;
  @Input() selectedItems: T[] = [];
  @Input() currentPageReportTemplate = 'Showing {first} to {last} of {totalRecords} items';
  @Input() sortField = '';
  @Input() sortableHeaders: { field: string; label: string }[] = [];
  @Input() hasCheckbox = false;
  @Input() checkboxLabel?: (item: T) => string;
  @Input() emptyMessage = 'No data available in table';

  @Output() loadTableItems = new EventEmitter<TableLazyLoadEvent>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() selectAllChange = new EventEmitter<TableSelectAllChangeEvent>();
  @Output() pageChange = new EventEmitter<PageTransitionEvent>();

  paginationPageSizeOptions = [5, 10, 15, 20];

  @ViewChild('dt') dt?: Table;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('toolbar') toolbar!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('caption') caption!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('header') header!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('body') body!: TemplateRef<any>;

  showing = 'Showing 0 to 0 of 0 entries';

  ngOnInit() {
    this.updateShowing();
  }

  ngAfterContentChecked() {
    this.updateShowing();
  }

  ngOnChanges() {
    this.updateShowing();
  }

  updateShowing() {
    if (!this.dt) return;
    const from = this.totalItems === 0 ? 0 : this.first + 1;
    let to = this.first;
    if (this.dt.rows) to += this.dt.rows;
    const total = this.dt.totalRecords ?? 0;
    if (to > total) to = total;
    this.showing = `Showing ${from} to ${to} of ${total} ${this.itemName}`;
  }

  get first(): number {
    return this.dt?.first ?? 0;
  }

  set first(first: number) {
    if (!this.dt) return;
    this.dt.first = first;
  }

  changePage(value: PaginatorState) {
    if (!this.dt) return;
    this.dt.onPageChange({ first: value.first ?? 0, rows: value.rows ?? 0 });
  }
}
