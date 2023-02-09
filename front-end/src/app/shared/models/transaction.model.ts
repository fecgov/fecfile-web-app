import { BaseModel } from './base.model';
import { Contact } from './contact.model';
import { MemoText } from './memo-text.model';
import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from './schb-transaction.model';
import { ValidateService } from '../services/validate.service';
import { TransactionType } from './transaction-types/transaction-type.model';
import { Type } from 'class-transformer';

export abstract class Transaction extends BaseModel {
  id: string | undefined;

  @Type(() => TransactionType)
  transactionType: TransactionType | undefined;

  // FECFile spec properties

  form_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id: string | undefined;

  // FECFile Online custom properties

  transaction_type_identifier: string | undefined;
  itemized: boolean | undefined;

  parent_transaction: Transaction | undefined;
  parent_transaction_id: string | undefined; // Foreign key to the parent transaction db record

  created: string | undefined;
  updated: string | undefined;
  deleted: string | undefined;

  report_id: string | undefined; // Foreign key to the parent report db record

  @Type(() => Contact)
  contact: Contact | undefined;
  contact_id: string | undefined; // Foreign key to the Contact db record

  @Type(() => MemoText)
  memo_text: MemoText | undefined;
  memo_text_id: string | undefined;

  children: Transaction[] | undefined;

  fields_to_validate: string[] | undefined; // Fields to run through validation in the API when creating or updating a transaction
  getFieldsNotToValidate(): string[] {
    return ['transaction_id'];
  }

  schema_name: string | undefined;

  abstract apiEndpoint: string; // Root URL for API endpoint

  /**
   * Perform bookkeeping updates to the transaction when it is created via fromJSON()
   * We have to pass the transactionType instead of getting from TransactonTypeUtils
   * in the method because that throw the error:
   *  Uncaught ReferenceError: Cannot access 'Transaction' before initialization
   * @param transactionType
   */
  setMetaProperties(transactionType: TransactionType): void {
    this.contact_id = this.contact?.id;
    this.transactionType = transactionType;
    this.schema_name = transactionType.getSchemaName();
    const fieldsToValidate: string[] = ValidateService.getSchemaProperties(transactionType.schema);
    const fieldsNotToValidate: string[] = this.getFieldsNotToValidate();
    this.fields_to_validate = fieldsToValidate.filter((p) => ![...fieldsNotToValidate].includes(p));
  }

  /**
   * updateChildren()
   * @returns
   *    An array of Transaction objects whose contribution_purpose_descriptions
   *    have been re-generated to account for changes to their parent
   *
   */
  updateChildren(): Transaction[] {
    const outChildren: Transaction[] = [];
    if (this.children) {
      for (const child of this.children as SchATransaction[]) {
        // Modify the purpose description this to reflect the changes to child transactions
        if (child?.transactionType?.generatePurposeDescription) {
          child.parent_transaction = this;
          const newDescrip = child.transactionType.generatePurposeDescriptionWrapper(child);
          const key = child.transactionType.templateMap.purpose_descrip as keyof ScheduleTransaction;
          ((child as ScheduleTransaction)[key] as string) = newDescrip;
        }
        outChildren.push(child);
      }
    }
    return outChildren;
  }

  /**
   * Returns a transaction payload with the parent of the original payload
   * swapped in as the main payload and the original main payload is a child
   * @returns
   */
  getUpdatedParent(childDeleted = false): Transaction {
    if (!this.parent_transaction?.transaction_type_identifier) {
      throw new Error(
        `Child transaction '${this.transaction_type_identifier}' is missing its parent when saving to API`
      );
    }

    // The parent is the new payload
    const payload = this.parent_transaction as Transaction;

    // Attach the original payload to the parent as a child, replacing an
    // existing version if needed
    if (this.id && this.parent_transaction) {
      payload.children = this.parent_transaction.children?.filter((c) => c.id !== this.id);
    }
    if (!childDeleted) {
      payload.children?.push(this);
    }
    payload.children = payload.updateChildren();

    // Update the CPD
    if (payload?.transactionType?.generatePurposeDescription) {
      const key = payload.transactionType.templateMap.purpose_descrip as keyof ScheduleTransaction;
      ((payload as ScheduleTransaction)[key] as string) =
        payload.transactionType.generatePurposeDescriptionWrapper(payload);
    }

    return payload;
  }
}

export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact;
}

// export type ScheduleTransactionKeys = SchATransaction & SchBTransaction;
export type ScheduleTransaction = SchATransaction | SchBTransaction;
export type ScheduleTransactionTypes = ScheduleATransactionTypes | ScheduleBTransactionTypes;

export enum AggregationGroups {
  GENERAL = 'GENERAL',
  LINE_15 = 'LINE_15',
  LINE_16 = 'LINE_16',
  NATIONAL_PARTY_CONVENTION_ACCOUNT = 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  NATIONAL_PARTY_RECOUNT_ACCOUNT = 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  NON_CONTRIBUTION_ACCOUNT = 'NON_CONTRIBUTION_ACCOUNT',
  OTHER_RECEIPTS = 'OTHER_RECEIPTS',
  RECOUNT_ACCOUNT = 'RECOUNT_ACCOUNT',
  GENERAL_DISBURSEMENT = 'GENERAL_DISBURSEMENT',
}
