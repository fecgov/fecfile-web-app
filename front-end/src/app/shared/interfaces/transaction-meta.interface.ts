import { JsonSchema } from './json-schema.interface';
import { Transaction } from './transaction.interface';

/**
 * Interface defines the meta data associated with a transaction type.
 * Populated by the transaction resovler for use in the transaction components.
 */
export interface TransactionMeta {
  scheduleId: string;
  componentGroupId: string;
  title: string;
  contributionPurposeDescripReadonly: (...params: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: JsonSchema;
  factory: () => Transaction;
  transaction: Transaction | null;
}
