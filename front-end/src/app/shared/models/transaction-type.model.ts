import { TransactionNavigationControls } from './transaction-navigation-controls.model';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { ContactType } from './contact.model';
import { Transaction, TransactionTypes } from './transaction.model';

/**
 * Class that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export abstract class TransactionType {
  abstract scheduleId: string;
  abstract componentGroupId: string; // Identifier of transaction component use to render UI form entry page
  abstract title: string;
  abstract schema: JsonSchema; // FEC validation JSON schema
  negativeAmountValueOnly = false; // Set to true if the amount for the transaction can only have a negative value
  isRefundAggregate = false; // Boolean flag to control whether or not the amount is subtracted from the aggregate
  showAggregate = true; // Boolean flag to show/hide the calculated aggregate input on the transaction forms
  isDependentChild = false; // When set to true, the parent transaction of the transaction is used to generate UI form entry page
  dependentChildTransactionType?: TransactionTypes; // For double-entry transaction forms, this property defines the transaction type of the dependent child transaction
  updateParentOnSave = false; // Set to true when the parent transaction may be affected by a change in the transaction
  contactTypeOptions?: ContactType[]; // Override the default list of contact types in the transaction component
  defaultContactTypeOption?: ContactType; // Set this to the default contact type (entity type) of the form select box if it is other than the first contact type in the contactTypeOptions list
  subTransactionConfig?: (SubTransactionGroup | TransactionTypes)[] | SubTransactionGroup; // Configuration of Sub-TransactionTypes
  shortName?: string; // Short name for transaction. Could be used in context where most of the name can be inferred (e.g: Individual, PAC, Tribal, Partnership)
  navigationControls?: TransactionNavigationControls;
  generatePurposeDescription?(transaction: Transaction): string; // Dynamically generates the text in the CPD or EPD field
  purposeDescriptionLabelNotice?: string; // Additional italicized text that appears beneath the form input label
  abstract templateMap: TransactionTemplateMapType; // Mapping of values between the schedule (A,B,C...) and the common identifiers in the HTML templates
  abstract getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type

  getSchemaName(): string {
    const schema_name = this?.schema?.$id?.split('/').pop()?.split('.')[0];
    if (!schema_name) {
      throw new Error('Fecfile: Schema name for transaction type not found.');
    }
    return schema_name;
  }

  generatePurposeDescriptionLabel(): string {
    if (this.generatePurposeDescription !== undefined) {
      return '(SYSTEM-GENERATED)';
    } else if (this.schema.required.includes(this.templateMap.purpose_description)) {
      return '(REQUIRED)';
    }
    return '(OPTIONAL)';
  }

  public generatePurposeDescriptionWrapper(transaction: Transaction): string {
    const purpose = this.generatePurposeDescription?.(transaction);
    if (purpose) {
      if (purpose.length > 100) {
        return purpose.slice(0, 97) + '...';
      }
      return purpose;
    }
    return '';
  }
}

export type TransactionTemplateMapType = {
  last_name: string;
  first_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  employer: string;
  occupation: string;
  organization_name: string;
  committee_fec_id: string;
  committee_name: string;
  date: string;
  dateLabel: string;
  memo_code: string;
  amount: string;
  aggregate: string;
  purpose_description: string;
  purposeDescripLabel: string;
  memo_text_input: string;
  category_code: string;
  election_code: string;
  election_other_description: string;
};

export class SubTransactionGroup {
  groupName: string;
  subTransactionTypes: TransactionTypes[];

  constructor(groupName: string, subTransactionTypes: TransactionTypes[]) {
    this.groupName = groupName;
    this.subTransactionTypes = subTransactionTypes;
  }
}
