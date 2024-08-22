import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Contact, ContactTypeLabels } from 'app/shared/models/contact.model';
import { ContactDisplayNamePipe } from 'app/shared/pipes/contact-display-name.pipe';
import { DeletedContactService } from 'app/shared/services/contact.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-deleted-contact-dialog',
  templateUrl: './deleted-contact-dialog.component.html',
})
export class DeletedContactDialogComponent extends TableListBaseComponent<Contact> implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() contactsRestored = new EventEmitter<string[]>();
  contactTypeLabels: LabelList = ContactTypeLabels;

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'sort_name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'employer', label: 'Employer' },
    { field: 'occupation', label: 'Occupation' },
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public contactDisplayNamePipe: ContactDisplayNamePipe,
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    public override itemService: DeletedContactService,
  ) {
    super(messageService, confirmationService, elementRef);
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  hide(): void {
    this.selectAll = false;
    this.onSelectionChange([]);
    this.visibleChange.emit(false);
    this.visible = false;
  }

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
}
