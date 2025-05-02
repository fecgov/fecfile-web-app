import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionContactUtils } from '../components/transaction-type-base/transaction-contact.utils';
import { Transaction, Contact, TransactionTemplateMapType, ContactTypes } from '../models';
import { ConfirmationService } from 'primeng/api';

export type dialogs = 'dialog' | 'childDialog' | 'childDialog_2';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationWrapperService {
  private readonly confirmationService = inject(ConfirmationService);

  async confirmWithUser(
    form: FormGroup,
    contactConfig: {
      [contactKey: string]: {
        [formField: string]: string;
      };
    },
    getContact: (contactKey: string, transaction?: Transaction) => Contact | null,
    getTemplateMap: (contactKey: string, transaction?: Transaction) => TransactionTemplateMapType | undefined,
    targetDialog: dialogs = 'dialog',
    transaction?: Transaction,
  ): Promise<boolean> {
    for (const [contactKey, config] of Object.entries(contactConfig)) {
      const templateMap = getTemplateMap(contactKey, transaction);
      if (!templateMap) {
        throw new Error('Fecfile: Cannot find template map when confirming transaction');
      }

      const contact = getContact(contactKey, transaction);
      if (contact === null) continue;
      let result = await this.createContactConfirmation(contact, form, templateMap, contactKey, targetDialog);
      if (!result) return false;
      result = await this.contactChangesConfirmation(contact, form, templateMap, targetDialog, config, transaction);
      if (!result) return false;
    }
    return true;
  }

  private async contactChangesConfirmation(
    contact: Contact,
    form: FormGroup,
    templateMap: TransactionTemplateMapType,
    targetDialog: dialogs,
    config: { [formField: string]: string },
    transaction?: Transaction,
  ): Promise<boolean> {
    const changes = TransactionContactUtils.getContactChanges(form, contact, templateMap, config, transaction);
    if (changes.length > 0) {
      const message = TransactionContactUtils.getContactChangesMessage(contact, changes);
      return this.displayConfirmationPopup(message, targetDialog);
    }
    return true;
  }

  private async createContactConfirmation(
    contact: Contact,
    form: FormGroup,
    templateMap: TransactionTemplateMapType,
    contactKey: string,
    targetDialog: dialogs,
  ): Promise<boolean> {
    if (!contact.id) {
      const message = this.getCreateTransactionContactConfirmationMessage(contact.type, form, templateMap, contactKey);
      return this.displayConfirmationPopup(message, targetDialog);
    }
    return true;
  }

  private displayConfirmationPopup(
    message: string,
    targetDialog: 'dialog' | 'childDialog' | 'childDialog_2' = 'dialog',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
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
   * Generate a message string that alerts the user that a new contact will be created
   * when the transaction is saved.
   * @param contactType
   * @param form
   * @param templateMap
   * @returns {string}
   */
  getCreateTransactionContactConfirmationMessage(
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
}
