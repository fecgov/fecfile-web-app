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
  schema: JsonSchema;
  transaction: Transaction | undefined;
  parentTransaction: Transaction | undefined;
  childTransactionType: TransactionType | undefined;
  contributionPurposeDescripReadonly(): string;
  getNewTransaction(): Transaction;
}
