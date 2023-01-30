import { BaseModel } from './base.model';
import { Contact } from './contact.model';
import { MemoText } from './memo-text.model';
import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from './schb-transaction.model';
import { ValidateUtils } from '../utils/validate.utils';
import { TransactionType } from './transaction-types/transaction-type.model';
import { Type } from 'class-transformer';

export abstract class Transaction extends BaseModel {
  id: string | undefined;
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

  abstract getUpdatedParent(childDeleted?: boolean): Transaction; // Method to handle save when child must update parent properties

  /**
   * Perform bookkeeping updates to the transaction when it is created via fromJSON()
   * We have to pass the transactionType instead of getting from TransactonTypeUtils
   * in the method because that throw the error:
   *  Uncaught ReferenceError: Cannot access 'Transaction' before initialization
   * @param transactionType
   */
  setMetaProperties(transactionType: TransactionType): void {
    this.contact_id = this.contact?.id;
    if (this?.transaction_type_identifier) {
      this.transactionType = transactionType;
      this.schema_name = transactionType.getSchemaName();
      const fieldsToValidate: string[] = ValidateUtils.getSchemaProperties(transactionType.schema);
      const fieldsNotToValidate: string[] = this.getFieldsNotToValidate();
      this.fields_to_validate = fieldsToValidate.filter((p) => ![...fieldsNotToValidate].includes(p));
    } else {
      throw new Error('No TRANSACTION_TYPE_IDENTIFIER found when setting Meta Properties');
    }
  }
}

export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact;
}

export type ScheduleTransaction = SchATransaction | SchBTransaction;
export type ScheduleTransactionTypes = ScheduleATransactionTypes | ScheduleBTransactionTypes;
