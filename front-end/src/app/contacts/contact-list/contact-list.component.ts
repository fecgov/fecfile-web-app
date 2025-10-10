import { Component, inject } from '@angular/core';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { PrimeTemplate } from 'primeng/api';
import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TableLazyLoadEvent } from 'primeng/table';
import { TableComponent } from '../../shared/components/table/table.component';
import { Toolbar } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { ContactDialogComponent } from '../../shared/components/contact-dialog/contact-dialog.component';
import { DeletedContactDialogComponent } from '../deleted-contact-dialog/deleted-contact-dialog.component';
import { LabelPipe } from '../../shared/pipes/label.pipe';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models';
import { ContactService, DeletedContactService } from 'app/shared/services/contact.service';
import { SelectModule } from 'primeng/select';

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
    ContactDialogComponent,
    DeletedContactDialogComponent,
    LabelPipe,
    SelectModule,
  ],
})
export class ContactListComponent extends TableListBaseComponent<Contact> {
  protected readonly itemService = inject(ContactService);
  public readonly deletedContactService = inject(DeletedContactService);
  contactTypeLabels: LabelList = ContactTypeLabels;
  dialogContactTypeOptions: PrimeOptions = [];

  restoreDialogIsVisible = false;
  restoreContactsButtonIsVisible = false;
  searchTerm = '';

  // contact lookup
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

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'sort_name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'sort_fec_id', label: 'FEC ID' },
    { field: 'employer', label: 'Employer' },
    { field: 'occupation', label: 'Occupation' },
  ];

  public async checkForDeletedContacts() {
    const contactListResponse = await this.deletedContactService.getTableData();
    const deletedContactsExist = contactListResponse.count > 0;
    this.restoreContactsButtonIsVisible = deletedContactsExist;
    return deletedContactsExist;
  }

  public override async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    await super.loadTableItems(event);
    await this.checkForDeletedContacts();
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  public override addItem() {
    this.dialogContactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    super.addItem();
  }

  public override editItem(item: Contact) {
    this.dialogContactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [item.type]);
    super.editItem(item);
    this.isNewItem = false;
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
