import { Component, effect, inject, model, output } from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { DeletedContactService } from 'app/shared/services/contact.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-deleted-contact-dialog',
  templateUrl: './deleted-contact-dialog.component.html',
  imports: [Dialog, TableComponent, ButtonDirective, Ripple, LabelPipe],
})
export class DeletedContactDialogComponent extends TableListBaseComponent<Contact> {
  protected readonly itemService = inject(DeletedContactService);

  readonly visible = model(false);
  contactsRestored = output<string[]>();
  contactTypeLabels: LabelList = ContactTypeLabels;

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'sort_name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'employer', label: 'Employer' },
    { field: 'occupation', label: 'Occupation' },
  ];

  constructor() {
    super();
    effect(() => {
      this.selectedItems.set([]);
    });
  }

  async restoreSelected(): Promise<void> {
    const restoredContacts = await this.itemService.restore(this.selectedItems());
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Contacts Successfully Restored',
      life: 3000,
    });
    this.contactsRestored.emit(restoredContacts);
    this.visible.set(false);
  }

  getCheckboxLabel(item: Contact): string {
    return `'select ' + ${this.displayName(item)}`;
  }

  protected getEmptyItem(): Contact {
    return new Contact();
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
}
