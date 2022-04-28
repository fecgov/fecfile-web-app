import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';
import { ListRestResponse } from '../../../shared/models/rest-api.model';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { Observable, forkJoin } from 'rxjs';

@Component({
  template: '',
})
export abstract class TableListBaseComponent<T> implements AfterViewInit {
  item!: T;
  items: T[] = [];
  totalItems = 0;
  pagerState: LazyLoadEvent | null = null;
  loading = false;
  selectAll = false;
  selectedItems: T[] = [];
  detailVisible = false;
  isNewItem = true;
  protected itemService!: TableListService<T>;

  constructor(
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService,
    protected elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    // Fix accessibility issues in paginator buttons.
    const paginatorNextButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-next');
    paginatorNextButton?.setAttribute('title', 'paginator go to next table page');
    const paginatorLastButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-last');
    paginatorLastButton?.setAttribute('title', 'paginator go to last table page');
  }

  /**
   * Returns and empty instance of the class model being displayed in the table.
   */
  protected abstract getEmptyItem(): T;

  /**
   * Makes the data service available to the component. Used for getting data from backend.
   * @param {TableListService<T>} itemService
   */
  protected loadItemService(itemService: TableListService<T>) {
    this.itemService = itemService;
  }

  /**
   * Method is called when the table data needs to be refreshed.
   * @param {LazyLoadEvent} event
   */
  public loadTableItems(event: LazyLoadEvent) {
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
            rows: 10,
          };
    }

    // Calculate the record page number to retrieve from the API.
    const first: number = event.first ? event.first : 0;
    const rows: number = event.rows ? event.rows : 10;
    const pageNumber: number = Math.floor(first / rows) + 1;

    // Determine query sort ordering
    let ordering: string = event.sortField ? event.sortField : '';
    if (ordering && event.sortOrder === -1) {
      ordering = `-${ordering}`;
    }

    this.itemService.getTableData(pageNumber, ordering).subscribe((response: ListRestResponse) => {
      this.items = [...response.results];
      this.totalItems = response.count;
      this.loading = false;
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
  public onSelectAllChange(event: { checked: boolean; event: PointerEvent }) {
    const checked: boolean = event.checked;

    if (checked) {
      this.itemService.getTableData(1).subscribe((response: ListRestResponse) => {
        this.selectedItems = response.results;
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

  public editItem(item: T) {
    this.item = item;
    this.detailVisible = true;
    this.isNewItem = false;
  }

  public deleteItem(item: T) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.delete(item).subscribe(() => {
          this.item = this.getEmptyItem();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Deleted', life: 3000 });
        });
      },
    });
  }

  public deleteSelectedItems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteSelectedItemsAccept,
    });
  }

  public deleteSelectedItemsAccept() {
    const obs: Observable<null>[] = [];
    this.selectedItems.forEach((item: T) => {
      obs.push(this.itemService.delete(item));
    });
    forkJoin(obs).subscribe(() => {
      this.items = this.items.filter((item: T) => !this.selectedItems.includes(item));
      this.selectedItems = [];
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
    });
  }
}
