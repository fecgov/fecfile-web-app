import { BaseModel } from './base.model';
import { Contact } from './contact.model';
import { MemoText } from './memo-text.model';
// import { SchATransaction, ScheduleATransactionTypes } from './scha-transaction.model';
// import { SchBTransaction, ScheduleBTransactionTypes } from './schb-transaction.model';

export abstract class Transaction extends BaseModel {
  id: string | undefined;

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

  contact: Contact | undefined;
  contact_id: string | undefined; // Foreign key to the Contact db record

  memo_text: MemoText | undefined;
  memo_text_id: string | undefined;

  children: Transaction[] | undefined;

  fields_to_validate: string[] | undefined; // Fields to run through validation in the API when creating or updating a transaction

  schema_name: string | undefined;

  abstract apiEndpoint: string; // Root URL for API endpoint

  abstract updateParent(): Transaction; // Method to handle save when child must update parent properties
}

export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact;
}

// export type ScheduleTransaction = Transaction | SchATransaction | SchBTransaction;

// export type ScheduleTransactionTypes = ScheduleATransactionTypes | ScheduleBTransactionTypes;
