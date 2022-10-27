import { TransactionNavigationControls } from '../models/transaction-navigation-controls.model';
import { JsonSchema } from './json-schema.interface';
import { Transaction } from './transaction.interface';

/**
 * Interface that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export interface TransactionType {
  scheduleId: string;
  componentGroupId: string; // Identifier of transaction component use to render UI form entry page
  isDependentChild: boolean; // When set to true, the parent transaction is used to generate UI form entry page
  title: string;
  schema: JsonSchema; // FEC validation JSON schema
  transaction?: Transaction;
  parentTransaction?: Transaction;
  childTransactionType?: TransactionType;
  navigationControls?: TransactionNavigationControls;
  contributionPurposeDescripReadonly(): string; // Dynamically generates the text in the CPD field
  getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type
}

export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasContact(transaction?: Transaction): boolean {
  return !transaction?.contact;
}
