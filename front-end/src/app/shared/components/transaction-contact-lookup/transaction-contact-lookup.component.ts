import { Component, input, output } from '@angular/core';
import { CandidateOfficeType, Contact, ContactTypes } from 'app/shared/models/contact.model';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { Transaction } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { ContactModalComponent } from '../contact-modal/contact-modal.component';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
  imports: [ContactLookupComponent, ErrorMessagesComponent, ContactModalComponent],
})
export class TransactionContactLookupComponent {
  readonly key = input('contact_1');
  readonly transaction = input<Transaction>();
  readonly formSubmitted = input(false);
  readonly contactTypeOptions = input.required<PrimeOptions>();

  readonly contactSelect = output<SelectItem<Contact>>();

  detailVisible = false;

  errorMessageFormControl?: SubscriptionFormControl;
  currentContactLabel = 'Individual';
  currentType = ContactTypes.INDIVIDUAL;
  mandatoryCandidateOffice?: CandidateOfficeType; // If the candidate is limited to one type of office, that office is set here.

  createNewContactSelected() {
    // this.contactDialog.updateContact(Contact.fromJSON({ type: this.currentType }));
    this.detailVisible = true;
  }

  setContact(contact: Contact) {
    this.contactSelect.emit({
      value: contact,
    });
    this.detailVisible = false;
  }
}
