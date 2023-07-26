import { AbstractControl, FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { Contact, ContactFields, ContactTypes } from '../../models/contact.model';

export class TransactionContactUtils {
  static getEditTransactionContactConfirmationMessage(
    contactChanges: string[],
    contact: Contact | undefined,
    form: FormGroup,
    fecDatePipe: FecDatePipe,
    templateMap: TransactionTemplateMapType
  ): string | undefined {
    if (contact) {
      const changesMessage = 'Change(s): <ul class="contact-confirm-dialog">'.concat(
        ...contactChanges.map((change) => `<li>${change}</li>`, '</ul>')
      );
      let contactName = contact.name;
      if (contact.type === ContactTypes.INDIVIDUAL) {
        contactName = `${contact.last_name}, ${contact.first_name}`;
        contactName += contact.middle_name ? ' ' + contact.middle_name : '';
      }
      const dateReceived = fecDatePipe.transform(form.get(templateMap.date)?.value);
      return (
        `By saving this transaction, you are also updating the contact for ` +
        `<b>${contactName}</b>. This change will only affect transactions with ` +
        `receipt date on or after ${dateReceived}.<br><br>${changesMessage}`
      );
    }
    return undefined;
  }

  static getCreateTransactionContactConfirmationMessage(
    contactType: ContactTypes,
    form: FormGroup,
    templateMap: TransactionTemplateMapType
  ): string {
    let confirmationContactTitle = '';
    switch (contactType) {
      case ContactTypes.INDIVIDUAL:
        confirmationContactTitle =
          `individual contact for <b>` +
          `${form.get(templateMap.last_name)?.value}, ` +
          `${form.get(templateMap.first_name)?.value}</b>`;
        break;
      case ContactTypes.COMMITTEE:
        confirmationContactTitle =
          `committee contact for <b>` + `${form.get(templateMap.organization_name)?.value}</b>`;
        break;
      case ContactTypes.ORGANIZATION:
        confirmationContactTitle =
          `organization contact for <b>` + `${form.get(templateMap.organization_name)?.value}</b>`;
        break;
    }
    return `By saving this transaction, you're also creating a new ${confirmationContactTitle}.`;
  }

  /**
   * This method returns the differences between the transaction
   * form's contact section and its database contact in prose
   * for the UI as a string[] (one entry for each change) after
   * first setting these values on the Contact object.
   * @returns string[] containing the changes in prose for the UI.
   */
  static setTransactionContactFormChanges(
    form: FormGroup,
    contact: Contact | undefined,
    templateMap: TransactionTemplateMapType,
    contactConfig: { [formField: string]: string }
  ): string[] {
    function getFormField(
      form: FormGroup,
      field: string,
      templateMap: TransactionTemplateMapType
    ): AbstractControl | null {
      if (field == 'committee_id') {
        return form.get(templateMap.committee_fec_id);
      }
      if (field == 'name') {
        return form.get(templateMap.organization_name);
      }
      return form.get(templateMap[field as keyof TransactionTemplateMapType]);
    }

    if (contact) {
      return Object.entries(contactConfig).map(([field, property]: string[]) => {
        const contactValue = contact[property as keyof Contact];
        const value = contactValue === '' ? null : contactValue; // Convert '' to null to match form field values.
        const formField = getFormField(form, field, templateMap);

        if (formField && formField?.value !== value) {
          contact[property as keyof Contact] = (formField.value || null) as never;
          if (!formField.value) {
            return `Removed ${ContactFields[property as keyof typeof ContactFields].toLowerCase()}`;
          }
          return `Updated ${ContactFields[property as keyof typeof ContactFields].toLowerCase()} to ${formField.value}`;
        }
        return '';
      });
      // return Object.entries(ContactFields)
      //   .map(([field, label]: string[]) => {
      //     const contactValue = contact[field as keyof typeof contact];
      //     const value = contactValue === '' ? null : contactValue; // Convert '' to null to match form field values.
      //     const formField = getFormField(form, field, templateMap);

      //     if (formField && formField?.value !== value) {
      //       contact[field as keyof typeof contact] = (formField.value || null) as never;
      //       if (!formField.value) {
      //         return `Removed ${label.toLowerCase()}`;
      //       }
      //       return `Updated ${label.toLowerCase()} to ${formField.value}`;
      //     }
      //     return '';
      //   })
      //   .filter((change) => change);
    }
    return [];
  }

  // static promptConfirmations(
  //   confirmationService: ConfirmationService,
  //   fecDatePipe: FecDatePipe,
  //   transaction: Transaction,
  //   form: FormGroup,
  //   contact: Contact
  // ) {
  //   if (contact.id) {

  //   } else {}
  // }

  static onContactLookupSelect(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactId$: Subject<string>
  ) {
    const contact: Contact = selectItem?.value;
    const templateMap = transaction?.transactionType?.templateMap;
    if (!(contact && templateMap)) return;
    switch (contact.type) {
      case ContactTypes.INDIVIDUAL:
        form.get(templateMap.last_name)?.setValue(contact.last_name);
        form.get(templateMap.first_name)?.setValue(contact.first_name);
        form.get(templateMap.middle_name)?.setValue(contact.middle_name);
        form.get(templateMap.prefix)?.setValue(contact.prefix);
        form.get(templateMap.suffix)?.setValue(contact.suffix);
        form.get(templateMap.employer)?.setValue(contact.employer);
        form.get(templateMap.occupation)?.setValue(contact.occupation);
        break;
      case ContactTypes.COMMITTEE:
        form.get(templateMap.committee_fec_id)?.setValue(contact.committee_id);
        form.get(templateMap.organization_name)?.setValue(contact.name);
        form.get(templateMap.committee_name)?.setValue(contact.name);
        break;
      case ContactTypes.ORGANIZATION:
        form.get(templateMap.organization_name)?.setValue(contact.name);
        break;
    }
    form.get(templateMap.street_1)?.setValue(contact.street_1);
    form.get(templateMap.street_2)?.setValue(contact.street_2);
    form.get(templateMap.city)?.setValue(contact.city);
    form.get(templateMap.state)?.setValue(contact.state);
    form.get(templateMap.zip)?.setValue(contact.zip);
    if (transaction) {
      transaction.contact_1 = contact;
    }
    contactId$.next(contact.id || '');
  }

  static onSecondaryContactLookupSelect(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transaction: Transaction | undefined
  ) {
    const contact: Contact = selectItem?.value;
    const templateMap = transaction?.transactionType?.templateMap;
    if (!(contact && templateMap)) return;
    form.get(templateMap.candidate_fec_id)?.setValue(contact.candidate_id);
    form.get(templateMap.candidate_last_name)?.setValue(contact.last_name);
    form.get(templateMap.candidate_first_name)?.setValue(contact.first_name);
    form.get(templateMap.candidate_middle_name)?.setValue(contact.middle_name);
    form.get(templateMap.candidate_prefix)?.setValue(contact.prefix);
    form.get(templateMap.candidate_suffix)?.setValue(contact.suffix);
    form.get(templateMap.candidate_office)?.setValue(contact.candidate_office);
    form.get(templateMap.candidate_state)?.setValue(contact.candidate_state);
    form.get(templateMap.candidate_district)?.setValue(contact.candidate_district);
    if (transaction) {
      transaction.contact_2 = contact;
    }
  }
}
