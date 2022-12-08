import { Component, ElementRef } from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ConfirmationService, MessageService } from 'primeng/api';

import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { Contact, ContactTypeLabels, ContactTypes } from '../../shared/models/contact.model';
import { ContactService } from '../../shared/services/contact.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
})
export class ContactListComponent extends TableListBaseComponent<Contact> {
  override item: Contact = new Contact();
  contactTypeLabels: LabelList = ContactTypeLabels;

  searchTerm = '';

  // contact lookup
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels).filter((option) =>
    [ContactTypes.COMMITTEE, ContactTypes.INDIVIDUAL].includes(option.code as ContactTypes)
  );

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: ContactService
  ) {
    super(messageService, confirmationService, elementRef);
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  public override addItem() {
    super.addItem();
    this.isNewItem = true;
  }

  public override editItem(item: Contact) {
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
      return `${item.first_name} ${item.last_name}`;
    } else {
      return item.name || '';
    }
  }

  public canDeleteContact(item: Contact): boolean {
    return !item?.transaction_count || item.transaction_count < 1;
  }
}
