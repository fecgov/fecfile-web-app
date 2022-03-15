import { Component, OnInit } from '@angular/core';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { ContactService } from '../../shared/services/contact.service';
import { Contact, ContactTypeLabels } from '../../shared/models/contact.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  item: Contact = new Contact();
  items: Contact[] = [];
  totalItems: number = 0;
  loading: boolean = false;
  selectAll: boolean = false;
  selectedItems: Contact[] = [];
  formSubmitted: boolean = false;
  dialogVisible: boolean = false;
  contactTypeLabels: LabelList = ContactTypeLabels;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private itemService: ContactService
  ) {}

  ngOnInit() {
    this.loading = true;
  }

  public loadTableItems(event: LazyLoadEvent) {
    this.loading = true;

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
    this.formSubmitted = false;
    this.dialogVisible = true;
  }

  public editItem(item: Contact) {
    this.item = item;
    this.dialogVisible = true;
  }

  public saveItem() {
    this.formSubmitted = true;

    if (!!this.item.name && this.item.name.trim()) {
      if (this.item.id) {
        this.items[this.findIndexById(this.item.id)] = this.item;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Updated', life: 3000 });
      } else {
        // this.item.id = this.createId();
        // this.item.image = 'item-placeholder.svg';
        this.items.push(this.item);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Item Created', life: 3000 });
      }

      this.items = [...this.items];
      this.dialogVisible = false;
      this.item = new Contact();
    }
  }

  public deleteItem(item: Contact) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + item.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.delete(item).subscribe((response: any) => {
          console.log('foo', response);
          this.items = this.items.filter((item: Contact) => item.id !== item.id);
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
        this.items = this.items.filter((item: Contact) => !this.selectedItems.includes(item));
        this.selectedItems = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
      },
    });
  }

  public hideDialog() {
    this.dialogVisible = false;
    this.formSubmitted = false;
  }

  private findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // createId(): string {
  //   let id = '';
  //   var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   for (var i = 0; i < 5; i++) {
  //     id += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return id;
  // }
}
