import { Component, computed, input, output, signal } from '@angular/core';
import { CandidateOfficeType, Contact, ContactTypes } from 'app/shared/models/contact.model';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
  imports: [ContactLookupComponent, ContactDialogComponent, ErrorMessagesComponent],
})
export class TransactionContactLookupComponent {
  readonly key = input('contact_1');
  readonly transaction = input<Transaction>();
  readonly formSubmitted = input(false);
  readonly contactTypeOptions = input.required<PrimeOptions>();
  readonly contactSelect = output<SelectItem<Contact>>();

  readonly detailVisible = signal(false);

  errorMessageFormControl?: SubscriptionFormControl;
  currentContactLabel = 'Individual';
  currentType = ContactTypes.INDIVIDUAL;

  // If the candidate is limited to one type of office, that office is set here.
  readonly mandatoryCandidateOffice = computed(() => {
    const transaction = this.transaction();
    if (
      transaction?.transactionType.templateMap.candidate_office &&
      transaction.transactionType.mandatoryFormValues &&
      transaction.transactionType.templateMap.candidate_office in transaction.transactionType.mandatoryFormValues
    ) {
      return transaction.transactionType.mandatoryFormValues[
        transaction.transactionType.templateMap.candidate_office
      ] as CandidateOfficeType;
    }
    return undefined;
  });

  createNewContactSelected() {
    this.detailVisible.set(true);
  }

  setContact(contact: Contact) {
    this.contactSelect.emit({
      value: contact,
    });
    this.detailVisible.set(false);
  }
}
