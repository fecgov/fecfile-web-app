import { TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { JsonSchema } from '../../interfaces/json-schema.interface';
import { ContactType } from '../contact.model';
import { Transaction, ScheduleTransactionTypes } from '../transaction.model';

/**
 * Class that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export abstract class TransactionType {
  abstract scheduleId: string;
  abstract componentGroupId: string; // Identifier of transaction component use to render UI form entry page
  abstract title: string;
  abstract schema: JsonSchema; // FEC validation JSON schema
  isDependentChild = false; // When set to true, the parent transaction of the transaction is used to generate UI form entry page
  updateParentOnSave = false; // Set to true when the parent transaction may be affected by a change in the transaction
  contactTypeOptions?: ContactType[]; // Override the default list of contact types in the transaction component
  defaultContactTypeOption?: ContactType; // Set this to the default contact type (entity type) of the form select box if it is other than the first contact type in the contactTypeOptions list
  transaction?: Transaction;
  childTransactionType?: TransactionType;
  subTransactionTypes?: ScheduleTransactionTypes[]; // TransactionTypes displayed in dropdown to choose from when creating a child transaction
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

  public generatePurposeDescriptionWrapper(): string {
    const purpose = this.generatePurposeDescription?.();
    if (purpose) {
      if (purpose.length > 100) {
        return purpose.slice(0, 97) + '...';
      }
      return purpose;
    }
    return '';
  }
}
