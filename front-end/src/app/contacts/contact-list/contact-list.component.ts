import { Component, ElementRef } from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';
import { ContactService, DeletedContactService } from '../../shared/services/contact.service';
import { TableLazyLoadEvent, TableSelectAllChangeEvent } from 'primeng/table';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent extends TableListBaseComponent<Contact> {
  override item: Contact = new Contact();
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

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    public override itemService: ContactService,
    public deletedContactService: DeletedContactService,
  ) {
    super(messageService, confirmationService, elementRef);

    this.checkForDeletedContacts();
  }

  public async checkForDeletedContacts() {
    const contactListResponse = await firstValueFrom(this.deletedContactService.getTableData());
    const deletedContactsExist = contactListResponse.count > 0;
    this.restoreContactsButtonIsVisible = deletedContactsExist;
    return deletedContactsExist;
  }

  public override loadTableItems(event: TableLazyLoadEvent): void {
    super.loadTableItems(event);

    this.checkForDeletedContacts();
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  public override addItem() {
    this.dialogContactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    super.addItem();
    this.isNewItem = true;
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

  public override onSelectAllChange(event: TableSelectAllChangeEvent) {
    const checked: boolean = event.checked;

    if (checked) {
      this.itemService.getTableData(1).subscribe((response: ListRestResponse) => {
        this.selectedItems = response.results.filter((item: Contact) => this.canDeleteItem(item)) || [];
        this.selectAll = true;
      });
    } else {
      this.selectedItems = [];
      this.selectAll = false;
    }
  }

  saveContact(contact: Contact) {
    if (contact.id) {
      this.itemService.update(contact).subscribe(() => {
        this.loadTableItems({});
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.itemService.create(contact).subscribe(() => {
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
