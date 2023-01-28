import { TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { JsonSchema } from '../../interfaces/json-schema.interface';
import { ContactType } from '../contact.model';
import { Transaction } from '../transaction.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';

/**
 * Class that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export abstract class TransactionType {
  abstract scheduleId: string;
  abstract componentGroupId: string; // Identifier of transaction component use to render UI form entry page
  abstract title: string;
  abstract schema: JsonSchema; // FEC validation JSON schema
  isDependentChild = false; // When set to true, the parent transaction is used to generate UI form entry page
  updateParentOnSave = false; // Some transaction types affect their parent's properties and therefore must have the payload repackaged when sent to the API
  contactTypeOptions?: ContactType[];
  transaction?: Transaction;
  childTransactionType?: TransactionType;
  childTransactionTypes?: ScheduleATransactionTypes[] | ScheduleBTransactionTypes[]; // TransactionTypes to choose from when creating a sub transaction
  navigationControls?: TransactionNavigationControls;
  generatePurposeDescription?(): string; // Dynamically generates the text in the CPD or EPD field
  generatePurposeDescriptionLabel?(): string; // Get the CPD or EPD field label
  purposeDescriptionLabelNotice?: string; // Additional italicized text that appears beneath the form input label
  abstract getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type

  getSchemaName(): string {
    const schema_name = this?.schema?.$id?.split('/').pop()?.split('.')[0];
    if (!schema_name) {
      throw new Error('Schema name for transaction type not found.');
    }
    return schema_name;
  }
}
