import { Contact } from '../models/contact.model';
import { MemoText } from '../models/memo-text.model';

export interface Transaction {
  id: string | undefined;
  report_id: string | undefined;
  contact: Contact | undefined;
  contact_id: string | undefined;
  memo_text: MemoText | undefined;
  memo_text_id: string | undefined;
  form_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id: string | undefined;
  transaction_type_identifier: string | undefined;
  itemized: boolean | undefined;
  contribution_purpose_descrip: string | undefined;
  parent_transaction: Transaction | undefined;
  parent_transaction_object_id: string | undefined;
  children: Transaction[] | undefined;
  fields_to_validate: string[] | undefined;
}
export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact;
}
