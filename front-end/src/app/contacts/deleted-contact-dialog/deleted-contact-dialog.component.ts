import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { DeletedContactService } from 'app/shared/services/contact.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-deleted-contact-dialog',
  templateUrl: './deleted-contact-dialog.component.html',
  styleUrls: ['./deleted-contact-dialog.component.scss'],
})
export class DeletedContactDialogComponent extends TableListBaseComponent<Contact> implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() contactsRestored = new EventEmitter<string[]>();
  restoreEnabled = false;
  contactTypeLabels: LabelList = ContactTypeLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    public override itemService: DeletedContactService
  ) {
    super(messageService, confirmationService, elementRef);
  }

  hide(): void {
    this.selectAll = false;
    this.visibleChange.emit(false);
    this.visible = false;
  }

  onShow(): void {}

  restoreSelected(): void {
    this.itemService.restore(this.selectedItems).subscribe((restoredContacts: string[]) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Contacts Successfully Restored',
        life: 3000,
      });
      this.contactsRestored.emit(restoredContacts);
      this.hide();
    });
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
