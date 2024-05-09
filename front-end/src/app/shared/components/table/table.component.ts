import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TableLazyLoadEvent, TableSelectAllChangeEvent } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent<T> {
  @Input() title = '';
  @Input() items: T[] = [];
  @Input() globalFilterFields = [''];
  @Input() totalItems = 0;
  @Input() loading = false;
  @Input() rowsPerPage = 5;
  @Input() selectAll = false;
  @Input() selectedItems: T[] = [];
  @Input() currentPageReportTemplate = 'Showing {first} to {last} of {totalRecords} items';
  @Input() sortField = '';
  @Input() sortableHeaders: { field: string; label: string }[] = [];
  @Input() hasCheckbox = false;
  @Input() checkboxLabel?: (item: T) => string;

  @Output() loadTableItems = new EventEmitter<TableLazyLoadEvent>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() selectAllChange = new EventEmitter<TableSelectAllChangeEvent>();
  @Output() rowsPerPageChange = new EventEmitter();

  paginationPageSizeOptions = [5, 10, 15, 20];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('toolbar') toolbar!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('caption') caption!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('header') header!: TemplateRef<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ContentChild('body') body!: TemplateRef<any>;
}
