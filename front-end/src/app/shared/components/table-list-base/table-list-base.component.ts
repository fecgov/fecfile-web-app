/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, inject, output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { DestroyerComponent } from '../app-destroyer.component';
import { TableLazyLoadEvent, TableSelectAllChangeEvent } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';
import { ListRestResponse } from 'app/shared/models';

@Component({
  template: '',
})
export abstract class TableListBaseComponent<T> extends DestroyerComponent implements AfterViewInit {
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);
  protected readonly elementRef = inject(ElementRef);
  protected abstract readonly itemService: TableListService<T>;

  item!: T;
  items: T[] = [];
  rowsPerPage = 10;
  totalItems = 0;
  pagerState: TableLazyLoadEvent | undefined;
  loading = true;
  selectAll = false;
  selectedItems: T[] = [];
  detailVisible = false;
  isNewItem = true;

  protected caption?: string;

  readonly reloadTables = output<void>();

  ngAfterViewInit(): void {
    // Fix accessibility issues in paginator buttons.
    const paginatorFirstButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-first');
    paginatorFirstButton?.setAttribute('title', 'paginator go to first table page');
    const paginatorPrevButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-prev');
    paginatorPrevButton?.setAttribute('title', 'paginator go to previous table page');
    const paginatorNextButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-next');
    paginatorNextButton?.setAttribute('title', 'paginator go to next table page');
    const paginatorLastButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-last');
    paginatorLastButton?.setAttribute('title', 'paginator go to last table page');

    if (this.caption) {
      const table = (<HTMLElement>this.elementRef.nativeElement).querySelector('table');
      if (table) {
        const captionElem = table.createCaption();
        captionElem.innerHTML = this.caption;
        (<HTMLElement>captionElem).className = 'sr-only';
      }
    }
  }

  /**
   * Method is called when the table data needs to be refreshed.
   * @param {TableLazyLoadEvent} event
   */
  public async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    this.loading = true;

    // event is undefined when triggered from the detail page because
    // the detail doesn't know what page we are on. We check the local
    // pagerState variable to retrieve the page state.
    if (!!event && 'first' in event) {
      this.pagerState = event;
    } else {
      event = this.pagerState
        ? this.pagerState
        : {
            first: 0,
            rows: this.rowsPerPage,
          };
    }

    // Calculate the record page number to retrieve from the API.
    const first: number = event.first ? event.first : 0;
    const rows: number = event.rows ? event.rows : 10;
    const pageNumber: number = Math.floor(first / rows) + 1;
    const params = this.getParams();

    // Determine query sort ordering
    let ordering: string | string[] = event.sortField ? event.sortField : '';
    if (ordering && event.sortOrder === -1) {
      ordering = `-${ordering}`;
    } else {
      ordering = `${ordering}`;
    }

    const response = await this.itemService.getTableData(pageNumber, ordering, params);
    try {
      this.items = [...response.results];
    } catch (err) {
      this.items = [];
      console.log(err);
    }

    this.totalItems = response.count;
    this.loading = false;
  }

  onRowsPerPageChange(rowsPerPage: number) {
    this.rowsPerPage = rowsPerPage;
    this.loadTableItems({
      first: 0,
      rows: this.rowsPerPage,
    });
  }

  /**
   * Event listener when user selects table row checkboxes.
   * @param items
   */
  public onSelectionChange(items: T[] = []) {
    this.selectAll = items.length === this.totalItems;
    this.selectedItems = items;
  }

  /**
   * Event listener when user selects the "all" checkbox to select/deselect row checkboxes.
   * @param event
   */
  public async onSelectAllChange(event: TableSelectAllChangeEvent): Promise<void> {
    const checked: boolean = event.checked;

    if (checked) {
      await this.itemService.getTableData(1).then((response: ListRestResponse) => {
        this.selectedItems = response.results || [];
        this.selectAll = true;
      });
    } else {
      this.selectedItems = [];
      this.selectAll = false;
    }
  }

  public addItem() {
    this.item = this.getEmptyItem();
    this.detailVisible = true;
    this.isNewItem = true;
  }

  public editItem(item: T): Promise<boolean> | void {
    this.item = item;
    this.detailVisible = true;
    this.isNewItem = false;
  }

  public deleteItem(item: T): void | Promise<void> {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.delete(item).then(() => {
          this.item = this.getEmptyItem();
          this.refreshTable();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
        });
      },
    });
  }

  public async deleteSelectedItems(): Promise<void> {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteSelectedItemsAccept.bind(this),
    });
  }

  public async deleteSelectedItemsAccept() {
    const obs: Promise<null>[] = [];
    this.selectedItems.forEach((item: T) => {
      obs.push(this.itemService.delete(item));
    });
    await Promise.all(obs);
    this.items = this.items.filter((item: T) => !this.selectedItems.includes(item));
    this.selectedItems = [];
    this.refreshTable();
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
  }

  public refreshAllTables() {
    this.reloadTables.emit();
  }

  public refreshTable() {
    return this.loadTableItems({} as TableLazyLoadEvent);
  }

  /**
   * getParams() is a method that provides optional parameters that the table-list-base component
   * will pass in the GET request that loads the table's items, passing the parameters through the
   * itemService and to the api service.  A component extending this component can override this
   * method in order to control the parameters being sent in the GET request without overriding the
   * entire loadTableItems() method.
   *
   * @return QueryParams
   */

  public getParams(): QueryParams {
    return { page_size: this.rowsPerPage };
  }

  public onRowActionClick(action: TableAction, item: T) {
    action.action(item);
  }

  /**
   * Returns and empty instance of the class model being displayed in the table.
   */
  protected abstract getEmptyItem(): T;
}

export class TableAction {
  label: string;
  action: (item?: any) => void | Promise<void> | Promise<boolean>;

  constructor(
    label: string,
    action: (item?: any) => void | Promise<void> | Promise<boolean>,
    isAvailable?: (item?: any) => boolean,
    isEnabled?: (item?: any) => boolean,
  ) {
    this.label = label;
    this.action = action;
    this.isAvailable = isAvailable || this.isAvailable;
    this.isEnabled = isEnabled || this.isEnabled;
  }

  isAvailable: (item?: any) => boolean = () => true;

  isEnabled: (item?: any) => boolean = () => true;
}
