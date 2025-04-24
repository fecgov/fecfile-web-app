/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, computed, effect, ElementRef, inject, output, Signal, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { TableLazyLoadEvent } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';

@Component({
  template: '',
})
export abstract class TableListBaseComponent<T> implements AfterViewInit {
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);
  protected readonly elementRef = inject(ElementRef);
  protected abstract readonly itemService: TableListService<T>;

  item!: T;
  items: T[] = [];
  readonly rowsPerPage = signal(10);
  totalItems = 0;
  pagerState?: TableLazyLoadEvent;
  loading = true;
  readonly selectedItems = signal<T[]>([]);
  detailVisible = false;
  isNewItem = true;
  readonly first = signal(0);

  protected caption?: string;

  readonly reloadTables = output<void>();

  constructor() {
    effect(() => {
      this.rowsPerPage();
      this.loadTableItems({
        first: 0,
        rows: this.rowsPerPage(),
      });
    });
  }

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
      event = this.pagerState ?? {
        first: 0,
        rows: this.rowsPerPage(),
      };
    }

    // Calculate the record page number to retrieve from the API.
    const first: number = event.first ?? 0;
    const rows: number = event.rows ?? 10;
    const pageNumber: number = Math.floor(first / rows) + 1;
    const params = this.params();

    // Determine query sort ordering
    let ordering: string | string[] = event.sortField ?? '';
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
    this.selectedItems().forEach((item: T) => {
      obs.push(this.itemService.delete(item));
    });
    await Promise.all(obs);
    this.items = this.items.filter((item: T) => !this.selectedItems().includes(item));
    this.selectedItems.set([]);
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
   * params() is a method that provides optional parameters that the table-list-base component
   * will pass in the GET request that loads the table's items, passing the parameters through the
   * itemService and to the api service.  A component extending this component can override this
   * method in order to control the parameters being sent in the GET request without overriding the
   * entire loadTableItems() method.
   *
   * @return QueryParams
   */

  readonly params: Signal<QueryParams> = computed(() => {
    return { page_size: this.rowsPerPage() };
  });

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
