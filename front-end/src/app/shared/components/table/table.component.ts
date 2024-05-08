import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TableLazyLoadEvent, TableSelectAllChangeEvent } from 'primeng/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
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
  @Input() sortField = ""

  @Output() loadTableItems = new EventEmitter<TableLazyLoadEvent>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() selectAllChange = new EventEmitter<TableSelectAllChangeEvent>();
  @Output() rowsPerPageChange = new EventEmitter();

  paginationPageSizeOptions = [5, 10, 15, 20];

  @ContentChild('toolbar') toolbar!: TemplateRef<any>;
  @ContentChild('caption') caption!: TemplateRef<any>;
  @ContentChild('header') header!: TemplateRef<any>;
  @ContentChild('body') body!: TemplateRef<any>;
}
