import { Component, ElementRef } from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ListRestResponse } from 'app/shared/models/rest-api.model';
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

  restoreDialogIsVisible = false;
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
    public override itemService: ContactService
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
      return `${item.last_name}, ${item.first_name}`;
    } else {
      return item.name || '';
    }
  }

  public canDeleteItem(item: Contact): boolean {
    return item.contact_1_transaction_count === 0 && item.contact_2_transaction_count === 0;
  }

  public onRestoreClick() {
    this.restoreDialogIsVisible = true;
  }

  public override onSelectAllChange(event: { checked: boolean; event: PointerEvent }) {
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
}
