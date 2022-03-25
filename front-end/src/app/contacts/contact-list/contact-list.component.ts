import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from 'app/shared/components/table-list-base.component';

import { ContactService } from '../../shared/services/contact.service';
import { Contact, ContactTypeLabels } from '../../shared/models/contact.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  // styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent extends TableListBaseComponent<Contact> implements OnInit {
  override item: Contact = new Contact();
  contactTypeLabels: LabelList = ContactTypeLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override itemService: ContactService
  ) {
    super(messageService, confirmationService);
  }

  ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  public override addItem() {
    super.addItem();
    this.isNewContact = true;
  }

  public override editItem(item: Contact) {
    super.editItem(item);
    this.isNewContact = false;
  }
}
