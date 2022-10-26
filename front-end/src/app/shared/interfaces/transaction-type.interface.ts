import { Contact } from '../models/contact.model';
import { TransactionNavigationControls } from '../models/transaction-navigation-controls.model';
import { JsonSchema } from './json-schema.interface';
import { Transaction } from './transaction.interface';

/**
 * Interface that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export interface TransactionType {
  scheduleId: string;
  componentGroupId: string;
  title: string;
  schema: JsonSchema;
  transaction?: Transaction;
  contact?: Contact;
  parent?: Transaction;
  navigationControls?: TransactionNavigationControls;

  contributionPurposeDescripReadonly(): string;
  getNewTransaction(): Transaction;
}

export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
