import { Component, computed, inject, OnInit, resource } from '@angular/core';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { PrimeTemplate } from 'primeng/api';
import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TableLazyLoadEvent, TableSelectAllChangeEvent } from 'primeng/table';
import { TableComponent } from '../../shared/components/table/table.component';
import { Toolbar } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { DeletedContactDialogComponent } from '../deleted-contact-dialog/deleted-contact-dialog.component';
import { LabelPipe } from '../../shared/pipes/label.pipe';
import { Contact, ContactTypeLabels, ContactTypes, emptyContact } from 'app/shared/models';
import { ContactService, DeletedContactService } from 'app/shared/services/contact.service';
import { ContactModalComponent } from 'app/shared/components/contact-modal/contact-modal.component';
import { ContactManagementService } from 'app/shared/services/contact-management.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  imports: [
    TableComponent,
    Toolbar,
    PrimeTemplate,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    ContactModalComponent,
    DeletedContactDialogComponent,
    LabelPipe,
  ],
})
export class ContactListComponent extends TableListBaseComponent<Contact> implements OnInit {
  protected readonly itemService = inject(ContactService);
  readonly cmService = inject(ContactManagementService);
  public readonly deletedContactService = inject(DeletedContactService);
  contactTypeLabels: LabelList = ContactTypeLabels;

  restoreDialogIsVisible = false;
  searchTerm = '';

  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.COMMITTEE,
    ContactTypes.INDIVIDUAL,
  ]);

  public rowActions: TableAction[] = [
    new TableAction('Edit', this.editItem.bind(this)),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      () => true,
      (contact: Contact) => this.canDeleteItem(contact),
    ),
  ];

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'sort_name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'sort_fec_id', label: 'FEC ID' },
    { field: 'employer', label: 'Employer' },
    { field: 'occupation', label: 'Occupation' },
  ];

  readonly manager = computed(() => this.cmService.activeManager());

  readonly restoreContactsButtonIsVisible = resource({
    loader: async () => {
      const contactListResponse = await this.deletedContactService.getTableData();
      const deletedContactsExist = contactListResponse.count > 0;
      return deletedContactsExist;
    },
  });

  ngOnInit() {
    this.cmService.activeKey.set('');
  }

  public override async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    await super.loadTableItems(event);
    this.restoreContactsButtonIsVisible.reload();
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  public override addItem() {
    this.isNewItem = true;
    this.manager().setAsAllContacts();
    this.manager().contact.set(emptyContact(this.manager().contactType()));
    this.cmService.showDialog();
  }

  public override editItem(contact: Contact) {
    this.manager().setAsSingle(contact.type);
    this.isNewItem = false;
    this.manager().contact.set(contact);
    this.cmService.showDialog();
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Contact): string {
    if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(item.type)) {
      return `${item.last_name}, ${item.first_name}`;
    } else {
      return item.name || '';
    }
  }

  public canDeleteItem(item: Contact): boolean {
    return !item.has_transaction_or_report;
  }

  public onRestoreClick() {
    this.restoreDialogIsVisible = true;
  }

  public override async onSelectAllChange(event: TableSelectAllChangeEvent) {
    const checked: boolean = event.checked;

    if (checked) {
      const response = await this.itemService.getTableData(1);
      this.selectedItems = response.results.filter((item: Contact) => this.canDeleteItem(item)) || [];
      this.selectAll = true;
    } else {
      this.selectedItems = [];
      this.selectAll = false;
    }
  }

  saveContact(contact: Contact) {
    if (contact.id) {
      this.itemService.update(contact).then(() => {
        this.loadTableItems({});
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.itemService.create(contact).then(() => {
        this.loadTableItems({});
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Created',
          life: 3000,
        });
      });
    }
  }
}
