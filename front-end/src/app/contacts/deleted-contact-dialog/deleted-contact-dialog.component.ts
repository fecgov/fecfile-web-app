import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-deleted-contact-dialog',
  templateUrl: './deleted-contact-dialog.component.html',
  styleUrls: ['./deleted-contact-dialog.component.scss'],
})
export class DeletedContactDialogComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  restoreEnabled = false;
  contactTypeLabels: LabelList = ContactTypeLabels;

  constructor() {}

  ngOnInit(): void {}

  onHide(): void {
    this.visibleChange.emit(false);
    this.visible = false;
  }

  onShow(): void {}

  restoreSelected(): void {}

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
