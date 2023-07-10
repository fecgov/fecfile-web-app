import { JsonSchema } from '../interfaces/json-schema.interface';
import { ContactType } from './contact.model';
import { DoubleTransactionGroup } from './transaction-groups/double-transaction-group.model';
import { TransactionGroup } from './transaction-groups/transaction-group.model';
import { TransactionNavigationControls } from './transaction-navigation-controls.model';
import { Transaction, TransactionTypes } from './transaction.model';

/**
 * Class that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export abstract class TransactionType {
  abstract scheduleId: string;
  abstract apiEndpoint: string; // Root URL to API endpoint for CRUDing transaction
  abstract transactionGroup: TransactionGroup | DoubleTransactionGroup; // Transaction group used to render UI form entry page
  abstract title: string;
  abstract schema: JsonSchema; // FEC validation JSON schema
  abstract templateMap: TransactionTemplateMapType; // Mapping of values between the schedule (A,B,C...) and the common identifiers in the HTML templates
  abstract getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type
  updateParentOnSave = false; // Set to true when the parent transaction may be affected by a change in the transaction

  // Form display settings
  contactTypeOptions?: ContactType[]; // Override the default list of contact types in the transaction component
  defaultContactTypeOption?: ContactType; // Set this to the default contact type (entity type) of the form select box if it is other than the first contact type in the contactTypeOptions list
  negativeAmountValueOnly = false; // Set to true if the amount for the transaction can only have a negative value
  isRefund = false; // Boolean flag to identify the transaction type as a refund
  showAggregate = true; // Boolean flag to show/hide the calculated aggregate input on the transaction forms
  hasCandidateLookup = false; // Boolean flag to cause candidate lookup to display

  // Double-entry settings
  isDependentChild = false; // When set to true, the parent transaction of the transaction is used to generate UI form entry page
  dependentChildTransactionType?: TransactionTypes; // For double-entry transaction forms, this property defines the transaction type of the dependent child transaction
  inheritedFields?: TemplateMapKeyType[]; // fields that are copied from parent to child
  useParentContact = false; // True if the primary contact of the child transaction inherits the primary contact of its parent
  childTriggerFields?: TemplateMapKeyType[]; // fields that when updated in the child, trigger the parent to regenerate its description
  parentTriggerFields?: TemplateMapKeyType[]; // fields that when updated in the parent, trigger the child to regenerate its description

  // Navigations settings
  subTransactionConfig?: (SubTransactionGroup | TransactionTypes)[] | SubTransactionGroup; // Configuration of Sub-TransactionTypes
  shortName?: string; // Short name for transaction. Could be used in context where most of the name can be inferred (e.g: Individual, PAC, Tribal, Partnership)
  navigationControls?: TransactionNavigationControls;

  // Memo Code settings
  memoCodeMap?: { true: string; false: string }; // Show a SelectButton for memo code where the labels are the values in this map
  memoCodeTransactionTypes?: { true: TransactionTypes; false: TransactionTypes }; // Change the transaction type based on the value of memo_code (when it's a SelectButton)

  // Pupose description settings
  generatePurposeDescription?(transaction: Transaction): string; // Dynamically generates the text in the CPD or EPD field
  purposeDescriptionLabelNotice?: string; // Additional italicized text that appears beneath the form input label
  purposeDescriptionLabelSuffix?: string; // Additional text that will appear after the purpose_description input label. If this is not set, '(SYSTEM-GENERATED)', '(REQUIRED)', or '(OPTIONAL)' will be diplayed
  purposeDescriptionPrefix?: string; // Additional text that appears at the start of the start of the purpose description field

  getSchemaName(): string {
    const schema_name = this?.schema?.$id?.split('/').pop()?.split('.')[0];
    if (!schema_name) {
      throw new Error('Fecfile: Schema name for transaction type not found.');
    }
    return schema_name;
  }

  generatePurposeDescriptionLabel(): string {
    if (this.purposeDescriptionLabelSuffix) {
      return this.purposeDescriptionLabelSuffix;
    } else if (this.generatePurposeDescription !== undefined) {
      return PurposeDescriptionLabelSuffix.SYSTEM_GENERATED;
    } else if (this.schema.required.includes(this.templateMap.purpose_description)) {
      return PurposeDescriptionLabelSuffix.REQUIRED;
    }
    return PurposeDescriptionLabelSuffix.OPTIONAL;
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

  ////////////////////////////////////////////////////////////////////////////////////////////
  // Template variables to be integrated with #1193
  hasAmountInput = true;
  hasLoanInfoInput = false;
  hasLoanTermsInput = false;
}

export enum PurposeDescriptionLabelSuffix {
  SYSTEM_GENERATED = '(SYSTEM-GENERATED)',
  REQUIRED = '(REQUIRED)',
  OPTIONAL = '(OPTIONAL)',
}

export type TransactionTemplateMapType = {
  // Form fields
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
  candidate_fec_id: string;
  candidate_last_name: string;
  candidate_first_name: string;
  candidate_middle_name: string;
  candidate_prefix: string;
  candidate_suffix: string;
  candidate_office: string;
  candidate_state: string;
  candidate_district: string;
  date: string;
  memo_code: string;
  amount: string;
  balance: string;
  aggregate: string;
  purpose_description: string;
  text4000: string;
  category_code: string;
  election_code: string;
  election_other_description: string;

  // Labels and text strings
  dateLabel: string;
  amountInputHeader: string;
  purposeDescripLabel: string;
  candidateInputHeader: string;
};

export type TemplateMapKeyType = keyof TransactionTemplateMapType;

export class SubTransactionGroup {
  groupName: string;
  subTransactionTypes: TransactionTypes[];

  constructor(groupName: string, subTransactionTypes: TransactionTypes[]) {
    this.groupName = groupName;
    this.subTransactionTypes = subTransactionTypes;
  }
}
