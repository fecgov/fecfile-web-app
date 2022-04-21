import { Component } from '@angular/core';
import { ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { TableListService } from '../interfaces/table-list-service.interface';
import { Observable, forkJoin } from 'rxjs';

@Component({
  template: '',
})
export abstract class TableListBaseComponent<T> {
  item!: T;
  items: T[] = [];
  totalItems = 0;
  pagerState: LazyLoadEvent | null = null;
  loading = false;
  selectAll = false;
  selectedItems: T[] = [];
  detailVisible = false;
  isNewContact = true;
  protected itemService!: TableListService<T>;

  constructor(protected messageService: MessageService, protected confirmationService: ConfirmationService) {}

  protected abstract getEmptyItem(): T;

  protected loadItemService(itemService: TableListService<T>) {
    this.itemService = itemService;
  }

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

    this.itemService.getTableData(pageNumber).subscribe((response: ListRestResponse) => {
      this.items = [...response.results];
      this.totalItems = response.count;
      this.loading = false;
    });
  }

  public onSelectionChange(items: T[] = []) {
    this.selectAll = items.length === this.totalItems;
    this.selectedItems = items;
  }

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
    this.isNewContact = true;
  }

  public editItem(item: T) {
    this.item = item;
    this.detailVisible = true;
    this.isNewContact = false;
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
