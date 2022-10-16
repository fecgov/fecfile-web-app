import { Contact } from '../models/contact.model';
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
  transaction: Transaction | undefined;
  parentTransaction: Transaction | undefined;
  childTransactionType: TransactionType | undefined;
  contributionPurposeDescripReadonly(): string;
  getNewTransaction(): Transaction;
}
