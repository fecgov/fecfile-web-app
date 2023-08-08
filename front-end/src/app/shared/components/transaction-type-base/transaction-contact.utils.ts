import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { Contact, ContactFields, ContactTypes } from '../../models/contact.model';

export class TransactionContactUtils {
  static getCreateTransactionContactConfirmationMessage(
    contactType: ContactTypes,
    form: FormGroup,
    templateMap: TransactionTemplateMapType
  ): string {
    let confirmationContactTitle = '';
    switch (contactType) {
      case ContactTypes.INDIVIDUAL:
        confirmationContactTitle = `individual contact for <b> ${form.get(templateMap.last_name)?.value}, ${
          form.get(templateMap.first_name)?.value
        }</b>`;
        break;
      case ContactTypes.COMMITTEE:
        confirmationContactTitle = `committee contact for <b> ${form.get(templateMap.organization_name)?.value}</b>`;
        break;
      case ContactTypes.ORGANIZATION:
        confirmationContactTitle = `organization contact for <b> ${form.get(templateMap.organization_name)?.value}</b>`;
        break;
      case ContactTypes.CANDIDATE:
        confirmationContactTitle = `candidate contact for <b> ${form.get(templateMap.candidate_last_name)?.value}, ${
          form.get(templateMap.candidate_first_name)?.value
        }</b>`;
        break;
    }
    return `By saving this transaction, you're also creating a new ${confirmationContactTitle}.`;
  }

  static getContactChanges(
    form: FormGroup,
    contact: Contact,
    templateMap: TransactionTemplateMapType,
    contactConfig: { [formField: string]: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    return Object.entries(contactConfig)
      .map(([field, property]: string[]) => {
        const contactValue = contact[property as keyof Contact];
        const formField = form.get(templateMap[field as keyof TransactionTemplateMapType]);
        if (formField && formField?.value !== contactValue) {
          return [property, formField.value];
        }
        return undefined;
      })
      .filter((change) => !!change);
  }

  static updateContactWithForm(transaction: Transaction, templateMap: TransactionTemplateMapType, form: FormGroup) {
    Object.entries(transaction.transactionType?.contactConfig ?? {}).forEach(
      ([contactKey, config]: [string, { [formField: string]: string }]) => {
        if (transaction[contactKey as keyof Transaction]) {
          const contact = transaction[contactKey as keyof Transaction] as Contact;
          const contactChanges = TransactionContactUtils.getContactChanges(form, contact, templateMap, config);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contactChanges.forEach(([property, value]: [keyof Contact, any]) => {
            contact[property] = value as never;
          });
        }
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getContactChangesMessage(contact: Contact, dateString: string, contactChanges: [string, any][]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeMessages = contactChanges.map(([property, value]: [string, any]) => {
      if (!value) {
        return `<li>Removed ${ContactFields[property as keyof typeof ContactFields].toLowerCase()}</li>`;
      }
      return `<li>Updated ${ContactFields[property as keyof typeof ContactFields].toLowerCase()} to ${value}</li>`;
    });
    const changesMessage = 'Change(s): <ul class="contact-confirm-dialog">'.concat(...changeMessages.join(''), '</ul>');
    return (
      `By saving this transaction, you are also updating the contact for ` +
      `<b>${contact.getNameString()}</b>. This change will only affect transactions with ` +
      `receipt date on or after ${dateString}.<br><br>${changesMessage}`
    );
  }

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
