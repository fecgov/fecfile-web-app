import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TableListBaseComponent } from 'app/shared/components/table-list-base.component';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { ContactService } from '../../shared/services/contact.service';
import { Contact, ContactTypeLabels } from '../../shared/models/contact.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent extends TableListBaseComponent<Contact> implements OnInit {
  item: Contact = new Contact();
  items: Contact[] = [];
  totalItems: number = 0;
  pagerState: LazyLoadEvent | null = null;
  loading: boolean = false;
  selectAll: boolean = false;
  selectedItems: Contact[] = [];
  detailVisible: boolean = false;
  contactTypeLabels: LabelList = ContactTypeLabels;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private itemService: ContactService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = true;
  }

  public loadTableItems(event: LazyLoadEvent) {
    this.loading = true;

    // event is undefined when triggered from the detail page because
    // the detail doesn't know what page we are on. We check the local
    // pagerState variable to retrieve the page state.
    if (event) {
      this.pagerState = event;
    } else {
      event = !!this.pagerState
        ? this.pagerState
        : {
            first: 0,
            rows: 10,
          };
    }

    // TODO: Calculate edge case of correct first value when a number of items
    // have been deleted or the last item on a page

    // Calculate the record page number to retrieve from the API.
    const first: number = !!event.first ? event.first : 0;
    const rows: number = !!event.rows ? event.rows : 10;
    const pageNumber: number = Math.floor(first / rows) + 1;

    this.itemService.getTableData(pageNumber).subscribe((response: ListRestResponse) => {
      this.items = response.results;
      this.totalItems = response.count;
      this.loading = false;
    });
  }

  public onSelectionChange(items: Contact[] = []) {
    this.selectAll = items.length === this.totalItems;
    this.selectedItems = items;
  }

  public onSelectAllChange(event: any) {
    const checked: boolean = event.checked;

    if (checked) {
      this.itemService.getTableData().subscribe((response: ListRestResponse) => {
        this.selectedItems = response.results;
        this.selectAll = true;
      });
    } else {
      this.selectedItems = [];
      this.selectAll = false;
    }
  }

  public addItem() {
    this.item = new Contact();
    this.detailVisible = true;
  }

  public editItem(item: Contact) {
    this.item = item;
    this.detailVisible = true;
  }

  public deleteItem(item: Contact) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + item.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.delete(item).subscribe((response: null) => {
          this.items = this.items.filter((item: Contact) => item.id !== item.id);
          // MJT - refresh table
          this.item = new Contact();
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
      accept: () => {
        // this.itemService.delete(item)
        // MJT - refresh table
        this.items = this.items.filter((item: Contact) => !this.selectedItems.includes(item));
        this.selectedItems = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
      },
    });
  }

  // private findIndexById(id: number): number {
  //   let index = -1;
  //   for (let i = 0; i < this.items.length; i++) {
  //     if (this.items[i].id === id) {
  //       index = i;
  //       break;
  //     }
  //   }

  //   return index;
  // }

  // createId(): string {
  //   let id = '';
  //   var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   for (var i = 0; i < 5; i++) {
  //     id += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return id;
  // }
}
