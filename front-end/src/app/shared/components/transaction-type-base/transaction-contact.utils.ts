import { FormGroup } from '@angular/forms';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { CandidateOfficeTypes, Contact, ContactFields, ContactTypes } from '../../models/contact.model';

export class TransactionContactUtils {
  /**
   * Generate a message string that alerts the user that a new contact will be created
   * when the transaction is saved.
   * @param contactType
   * @param form
   * @param templateMap
   * @returns {string}
   */
  static getCreateTransactionContactConfirmationMessage(
    contactType: ContactTypes,
    form: FormGroup,
    templateMap: TransactionTemplateMapType,
    contactKey: string,
    messagePrologue = 'By saving this transaction',
  ): string {
    let confirmationContactTitle = '';
    if (!templateMap) {
      throw new Error('Fecfile: templateMap not found in getCreateTransactionContactconfirmationMessage');
    }
    switch (contactType) {
      case ContactTypes.INDIVIDUAL:
        confirmationContactTitle = `individual contact for <b> ${form.get(templateMap.last_name)?.value}, ${
          form.get(templateMap.first_name)?.value
        }</b>`;
        break;
      case ContactTypes.COMMITTEE:
        if (contactKey === 'contact_1') {
          confirmationContactTitle = `committee contact for <b> ${form.get(templateMap.organization_name)?.value}</b>`;
        } else {
          confirmationContactTitle = `committee contact for <b> ${form.get(templateMap.committee_name)?.value}</b>`;
        }
        break;
      case ContactTypes.ORGANIZATION:
        confirmationContactTitle = `organization contact for <b> ${
          contactKey === 'contact_2'
            ? form.get(templateMap.secondary_name)?.value
            : form.get(templateMap.organization_name)?.value
        }</b>`;
        break;
      case ContactTypes.CANDIDATE:
        confirmationContactTitle = `candidate contact for <b> ${form.get(templateMap.candidate_last_name)?.value}, ${
          form.get(templateMap.candidate_first_name)?.value
        }</b>`;
        break;
    }
    return `${messagePrologue}, you're also creating a new ${confirmationContactTitle}.`;
  }

  /**
   * Given a FormGroup and a Contact object, the method returns an array of data pairs (pairs in an array)
   * containing the contact property and the new contact property value from the form.
   * @param form
   * @param contact
   * @param templateMap
   * @param contactConfig
   * @returns
   */
  static getContactChanges(
    form: FormGroup,
    contact: Contact,
    templateMap: TransactionTemplateMapType,
    contactConfig: { [formField: string]: string },
    transaction?: Transaction,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    return Object.entries(contactConfig)
      .map(([field, property]: string[]) => {
        const contactValue = contact[property as keyof Contact];
        const formField = form.get(templateMap[field as keyof TransactionTemplateMapType]);
        let formFieldValue = formField?.value;

        // On IE Transactions, a Presidential Candidate running in a Primary election has a value for its state.
        // This value needs to be saved on the transaction *but not* on the contact, so we detect "undefined"
        // as the value for the contact.
        if (field === 'candidate_state' && transaction?.transactionType.scheduleId === ScheduleIds.E) {
          const candidateOfficeField = form.get(templateMap.candidate_office);
          const electionCodeField = form.get(templateMap.election_code);
          const candidateOffice = candidateOfficeField?.value ?? '';
          const electionCode = electionCodeField?.value ?? '';

          if (electionCode?.startsWith('P') && candidateOffice === CandidateOfficeTypes.PRESIDENTIAL) {
            formFieldValue = null;
          }
        }

        if (formField && formFieldValue !== contactValue) {
          return [property, formFieldValue];
        }
        return undefined;
      })
      .filter((change) => !!change);
  }

  /**
   * Build and return the message string to display to the user in the pop-up when
   * being alerted that a contact will be updated in the database.
   * @param contact
   * @param contactChanges
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getContactChangesMessage(contact: Contact, contactChanges: [string, any][]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeMessages = contactChanges.map(([property, value]: [string, any]) => {
      if (!value) {
        return `<li>Removed ${ContactFields[property as keyof typeof ContactFields].toLowerCase()}</li>`;
      }
      return `<li>Updated ${ContactFields[property as keyof typeof ContactFields].toLowerCase()} to ${value}</li>`;
    });
    const changesMessage = 'Change(s): <ul class="contact-confirm-dialog">'.concat(...changeMessages.join(''), '</ul>');
    return (
      `Your suggested changes for <b>${contact.getNameString()}</b> will affect all transactions involving this contact.` +
      `<br><br>${changesMessage}`
    );
  }

  static displayConfirmationPopup(
    message: string,
    confirmationService: ConfirmationService,
    targetDialog: 'dialog' | 'childDialog' | 'childDialog_2' = 'dialog',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      confirmationService.confirm({
        key: targetDialog,
        header: 'Confirm',
        icon: 'pi pi-info-circle',
        message: message,
        acceptLabel: 'Continue',
        rejectLabel: 'Cancel',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  /**
   * Loop though the contact records attached to a transaction object (i.e. 'contact_1', 'contact_2', etc)
   * and update the contact objects in place with the values entered into the transaction form for that contact.
   * @param transaction
   * @param templateMap
   * @param form
   */
  static updateContactsWithForm(transaction: Transaction, templateMap: TransactionTemplateMapType, form: FormGroup) {
    Object.entries(transaction.transactionType?.contactConfig ?? {}).forEach(
      ([contactKey, config]: [string, { [formField: string]: string }]) => {
        if (transaction[contactKey as keyof Transaction]) {
          const contact = transaction[contactKey as keyof Transaction] as Contact;
          const contactChanges = TransactionContactUtils.getContactChanges(
            form,
            contact,
            templateMap,
            config,
            transaction,
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          contactChanges.forEach(([property, value]: [keyof Contact, any]) => {
            contact[property] = value as never;
          });
        }
      },
    );
  }

  /**
   * Update the transaction form values for the first contact form fields (i.e. 'contact_1')
   * when a user has selected a contact from the lookup.
   * @param selectItem
   * @param form
   * @param transaction
   * @param contactId$
   * @returns
   */
  static updateFormWithPrimaryContact(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactId$: Subject<string>,
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
    contactId$.next(contact.id ?? '');
  }

  /**
   * Update the transaction form values for the second CANDIDATE contact form fields (i.e. 'contact_2')
   * when a user has selected a contact from a contact lookup on the form.
   * @param selectItem
   * @param form
   * @param transaction
   * @returns
   */
  static updateFormWithCandidateContact(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactId$: Subject<string>,
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
    contactId$.next(contact.id ?? '');
  }

  /**
   * Update the transaction form values for the SECONDARY contact form fields (i.e. 'contact_2')
   * when a user has selected a contact from a contact lookup on the form.
   * @param selectItem
   * @param form
   * @param transaction
   * @returns
   */
  static updateFormWithSecondaryContact(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactId$: Subject<string>,
  ) {
    const contact: Contact = selectItem?.value;
    const templateMap = transaction?.transactionType?.templateMap;
    if (!(contact && templateMap)) return;
    form.get(templateMap.secondary_name)?.setValue(contact.name);
    form.get(templateMap.secondary_street_1)?.setValue(contact.street_1);
    form.get(templateMap.secondary_street_2)?.setValue(contact.street_2);
    form.get(templateMap.secondary_city)?.setValue(contact.city);
    form.get(templateMap.secondary_state)?.setValue(contact.state);
    form.get(templateMap.secondary_zip)?.setValue(contact.zip);
    if (transaction) {
      transaction.contact_2 = contact;
    }
    contactId$.next(contact.id ?? '');
  }

  static updateFormWithTertiaryContact(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactId$: Subject<string>,
  ) {
    const contact: Contact = selectItem?.value;
    const templateMap = transaction?.transactionType?.templateMap;
    if (!(contact && templateMap)) return;
    form.get(templateMap.committee_fec_id)?.setValue(contact.committee_id);
    form.get(templateMap.committee_name)?.setValue(contact.name);
    if (transaction) {
      transaction.contact_3 = contact;
    }
    contactId$.next(contact.id ?? '');
  }
}

export type ContactIdMapType = { [contact: string]: Subject<string> };
