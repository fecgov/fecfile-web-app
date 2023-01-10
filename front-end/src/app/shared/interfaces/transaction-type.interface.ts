import { ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { ScheduleBTransactionTypes } from '../models/schb-transaction.model';
import { TransactionNavigationControls } from '../models/transaction-navigation-controls.model';
import { JsonSchema } from './json-schema.interface';
import { Transaction } from '../models/transaction.model';
import { ContactType } from '../models/contact.model';

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
  contactTypeOptions?: ContactType[];
  transaction?: Transaction;
  childTransactionType?: TransactionType;
  subTransactionTypes?: ScheduleATransactionTypes[] | ScheduleBTransactionTypes[]; // TransactionTypes to choose from when creating a sub transaction
  navigationControls?: TransactionNavigationControls;
  generatePurposeDescription?(): string; // Dynamically generates the text in the CPD or EPD field
  getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type
}
