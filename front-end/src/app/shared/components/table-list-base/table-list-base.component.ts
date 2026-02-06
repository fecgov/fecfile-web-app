import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  output,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { QueryParams } from 'app/shared/services/api.service';
import { TableComponent } from '../table/table.component';
import { TableAction } from '../table-actions-button/table-actions';

@Component({
  template: '',
})
export abstract class TableListBaseComponent<T> implements AfterViewInit {
  readonly messageService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);
  protected readonly elementRef = inject(ElementRef);
  protected abstract readonly itemService: TableListService<T>;

  item!: T;
  readonly items = signal<T[]>([]);
  readonly rowsPerPage = signal(10);
  readonly totalItems = signal(0);
  sort: SortEvent = {};
  loading = true;
  readonly selectedItems = signal<T[]>([]);
  readonly detailVisible = signal(false);
  isNewItem = true;
  readonly first = signal(0);
  readonly table = viewChild.required(TableComponent);

  protected caption?: string;

  readonly reloadTables = output<void>();

  readonly params: Signal<QueryParams> = computed(() => {
    return { page_size: this.rowsPerPage() };
  });

  constructor() {
    effect(() => {
      this.rowsPerPage();
      this.first.set(0);
    });

    effect(() => {
      const table = this.table();
      table.sortField();
      table.sortOrder();
      this.first();
      this.rowsPerPage();
      this.loadTableItems();
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
  public async loadTableItems(): Promise<void> {
    this.loading = true;
    const table = this.table();
    const sortField = table.sortField();
    const sortOrder = table.sortOrder() === 'asc' ? 1 : -1;
    const first = this.first();
    const rows = this.rowsPerPage();

    const pageNumber: number = Math.floor(first / rows) + 1;
    const params = this.params();

    // Determine query sort ordering
    let ordering: string | string[] = sortField ?? '';
    if (ordering && sortOrder === -1) {
      ordering = `-${ordering}`;
    } else {
      ordering = `${ordering}`;
    }

    const response = await this.itemService.getTableData(pageNumber, ordering, params);
    try {
      this.items.set([...response.results]);
    } catch (err) {
      this.items.set([]);
      console.log(err);
    }

    this.totalItems.set(response.count);
    this.loading = false;
  }

  public addItem() {
    this.item = this.getEmptyItem();
    this.detailVisible.set(true);
    this.isNewItem = true;
  }

  public editItem(item: T): Promise<boolean> | void {
    this.item = item;
    this.detailVisible.set(true);
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
    this.items.update((items) => items.filter((item: T) => !this.selectedItems().includes(item)));
    this.selectedItems.set([]);
    this.refreshTable();
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
  }

  public refreshAllTables() {
    this.reloadTables.emit();
  }

  refreshTable() {
    return this.loadTableItems();
  }

  public onRowActionClick(action: TableAction<T>, item: T) {
    action.action(item);
  }

  /**
   * Returns and empty instance of the class model being displayed in the table.
   */
  protected abstract getEmptyItem(): T;
}
