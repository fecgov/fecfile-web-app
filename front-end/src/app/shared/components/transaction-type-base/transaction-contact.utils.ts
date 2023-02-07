import { AbstractControl, FormGroup } from '@angular/forms';
import { ScheduleFormTemplateMapType } from 'app/shared/models/transaction.model';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { Contact, ContactFields, ContactTypes } from '../../models/contact.model';

export class TransactionContactUtils {
  static getEditTransactionContactConfirmationMessage(
    contactChanges: string[],
    contact: Contact | undefined,
    form: FormGroup,
    fecDatePipe: FecDatePipe,
    formTemplateMap: ScheduleFormTemplateMapType
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
      const dateReceived = fecDatePipe.transform(form.get(formTemplateMap.date)?.value);
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
    formTemplateMap: ScheduleFormTemplateMapType
  ): string {
    let confirmationContactTitle = '';
    switch (contactType) {
      case ContactTypes.INDIVIDUAL:
        confirmationContactTitle =
          `individual contact for <b>` +
          `${form.get(formTemplateMap.last_name)?.value}, ` +
          `${form.get(formTemplateMap.first_name)?.value}</b>`;
        break;
      case ContactTypes.COMMITTEE:
        confirmationContactTitle =
          `committee contact for <b>` + `${form.get(formTemplateMap.organization_name)?.value}</b>`;
        break;
      case ContactTypes.ORGANIZATION:
        confirmationContactTitle =
          `organization contact for <b>` + `${form.get(formTemplateMap.organization_name)?.value}</b>`;
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
    formTemplateMap: ScheduleFormTemplateMapType
  ): string[] {
    function getFormField(
      form: FormGroup,
      field: string,
      formTemplateMap: ScheduleFormTemplateMapType
    ): AbstractControl | null {
      if (field == 'committee_id') {
        return form.get(formTemplateMap.committee_fec_id);
      }
      if (field == 'name') {
        return form.get(formTemplateMap.organization_name);
      }
      return form.get(formTemplateMap[field as keyof ScheduleFormTemplateMapType]);
    }

    if (contact) {
      return Object.entries(ContactFields)
        .map(([field, label]: string[]) => {
          const contactValue = contact[field as keyof typeof contact];
          const formField = getFormField(form, field, formTemplateMap);

          if (formField && formField?.value !== contactValue) {
            contact[field as keyof typeof contact] = (formField.value || '') as never;
            return `Updated ${label.toLowerCase()} to ${formField.value || ''}`;
          }
          return '';
        })
        .filter((change) => change);
    }
    return [];
  }

  static onContactLookupSelect(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transactionType: TransactionType | undefined,
    contactId$: Subject<string>,
    formTemplateMap: ScheduleFormTemplateMapType
  ) {
    if (selectItem) {
      const contact: Contact = selectItem.value;
      if (contact) {
        switch (contact.type) {
          case ContactTypes.INDIVIDUAL:
            form.get(formTemplateMap.last_name)?.setValue(contact.last_name);
            form.get(formTemplateMap.first_name)?.setValue(contact.first_name);
            form.get(formTemplateMap.middle_name)?.setValue(contact.middle_name);
            form.get(formTemplateMap.prefix)?.setValue(contact.prefix);
            form.get(formTemplateMap.suffix)?.setValue(contact.suffix);
            form.get(formTemplateMap.employer)?.setValue(contact.employer);
            form.get(formTemplateMap.occupation)?.setValue(contact.occupation);
            break;
          case ContactTypes.COMMITTEE:
            form.get(formTemplateMap.committee_fec_id)?.setValue(contact.committee_id);
            form.get(formTemplateMap.organization_name)?.setValue(contact.name);
            break;
          case ContactTypes.ORGANIZATION:
            form.get(formTemplateMap.organization_name)?.setValue(contact.name);
            break;
        }
        form.get(formTemplateMap.street_1)?.setValue(contact.street_1);
        form.get(formTemplateMap.street_2)?.setValue(contact.street_2);
        form.get(formTemplateMap.city)?.setValue(contact.city);
        form.get(formTemplateMap.state)?.setValue(contact.state);
        form.get(formTemplateMap.zip)?.setValue(contact.zip);
        if (transactionType?.transaction) {
          transactionType.transaction.contact = contact;
        }
        contactId$.next(contact.id || '');
      }
    }
  }
}
