import { Component, computed, input, model, output, signal } from '@angular/core';
import { CandidateOfficeType, Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FormGroup } from '@angular/forms';
import { effectOnceIf } from 'ngxtension/effect-once-if';

export type ContactProperty = 'contact_1' | 'contact_2' | 'contact_3' | 'contact_4' | 'contact_5';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
  imports: [ContactLookupComponent, ContactDialogComponent, ErrorMessagesComponent],
})
export class TransactionContactLookupComponent {
  readonly contactProperty = input<ContactProperty>('contact_1');
  readonly transaction = input<Transaction>();
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input(false);
  readonly contactTypeOptions = model.required<PrimeOptions>();
  readonly contactSelect = output<SelectItem<Contact>>();

  readonly detailVisible = signal(false);

  errorMessageFormControl?: SubscriptionFormControl;
  readonly errorMessage = computed(() => {
    const type = this.currentType();
    const label = ContactTypeLabels.find((c) => c[0] === type)?.[1] ?? '';
    return `${label} information is required`;
  });
  readonly currentType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);

  // If the candidate is limited to one type of office, that office is set here.
  readonly mandatoryCandidateOffice = computed(() => {
    const transaction = this.transaction();
    if (
      transaction?.transactionType.templateMap.candidate_office &&
      transaction.transactionType.templateMap.candidate_office in transaction.transactionType.mandatoryFormValues
    ) {
      return transaction.transactionType.mandatoryFormValues[
        transaction.transactionType.templateMap.candidate_office
      ] as CandidateOfficeType;
    }
    return undefined;
  });

  constructor() {
    effectOnceIf(
      () => {
        const transaction = this.transaction();
        const form = this.form();
        const contactProperty = this.contactProperty();
        if (transaction && form && contactProperty) return { transaction, form, contactProperty };
        return null;
      },
      (data) => {
        if (data.transaction.id) {
          this.contactTypeOptions.set(
            LabelUtils.getPrimeOptions(ContactTypeLabels, [(data.transaction[data.contactProperty] as Contact).type]),
          );
        }
        if (data.contactProperty === 'contact_1') return;

        this.errorMessageFormControl = new SubscriptionFormControl(null, () => {
          if (!data.transaction[data.contactProperty] && this.contactIsRequired(data)) {
            return { required: true };
          }
          return null;
        });
        this.form().addControl(`${data.contactProperty}_lookup`, this.errorMessageFormControl);
      },
    );
  }

  private contactIsRequired(data: { transaction: Transaction; form: FormGroup; contactProperty: ContactProperty }) {
    switch (data.contactProperty) {
      case 'contact_2':
        return data.transaction.transactionType.contact2IsRequired(data.form);
      case 'contact_3':
        return data.transaction.transactionType.contact3IsRequired;
      case 'contact_4':
        return data.transaction.transactionType.contact4IsRequired(data.form);
      case 'contact_5':
        return data.transaction.transactionType.contact5IsRequired(data.form);
    }
    return false;
  }

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
