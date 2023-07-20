import { JsonSchema } from '../interfaces/json-schema.interface';
import {
  CANDIDATE_FIELDS,
  CANDIDATE_OFFICE_FIELDS,
  ELECTION_FIELDS,
  EMPLOYEE_INFO_FIELDS,
  LOAN_FINANCE_FIELDS,
  LOAN_TERMS_FIELDS,
  hasFields,
} from '../utils/transaction-type-properties';
import { ContactType } from './contact.model';
import { TransactionNavigationControls } from './transaction-navigation-controls.model';
import { Transaction, TransactionTypes } from './transaction.model';

/**
 * Class that defines the meta data associated with a transaction type.
 * Populated and used by the transaction resovler for use in the transaction components.
 */
export abstract class TransactionType {
  abstract scheduleId: string;
  abstract apiEndpoint: string; // Root URL to API endpoint for CRUDing transaction
  abstract formFields: string[];
  abstract contactTypeOptions?: ContactType[];
  abstract title: string;
  abstract schema: JsonSchema; // FEC validation JSON schema
  abstract templateMap: TransactionTemplateMapType; // Mapping of values between the schedule (A,B,C...) and the common identifiers in the HTML templates
  abstract getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type
  updateParentOnSave = false; // Set to true when the parent transaction may be affected by a change in the transaction

  // Form display settings
  negativeAmountValueOnly = false; // Set to true if the amount for the transaction can only have a negative value
  isRefund = false; // Boolean flag to identify the transaction type as a refund
  showAggregate = true; // Boolean flag to show/hide the calculated aggregate input on the transaction forms
  showStandardAmount = true; // Boolean flag to show/hide the standard amount control.  This is typically hidden if an alternate is used, like in Loans
  hasCandidateCommittee = false; //Boolean flag to show/hide committee inputs along side candidate info
  contact2IsRequired = false; // Boolean flag to cause contact_2 required to be added to the form validation

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

  // Labels
  dateLabel = 'DATE';
  amountInputHeader = '';
  purposeDescripLabel = '';

  description?: string; // Prose describing transaction and filling out the form
  accordionTitle?: string; // Title for accordion handle (does not include subtext)
  accordionSubText?: string; // Text after title in accordion handle
  formTitle?: string; // Title of form within accordion section
  footer?: string; // Text at the end of form
  contactTitle?: string; // Title for primary contact
  contactLookupLabel?: string; //Label above contact lookup

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

  getFormControlNames(templateMap: TransactionTemplateMapType): string[] {
    const templateFields = this.formFields
      .map((name: string) => templateMap[name as TemplateMapKeyType])
      .filter((field) => !!field);
    return ['entity_type', ...templateFields];
  }

  hasElectionInformation(): boolean {
    return hasFields(this.formFields, ELECTION_FIELDS);
  }
  hasCandidateInformation(): boolean {
    return hasFields(this.formFields, CANDIDATE_FIELDS);
  }
  hasCommitteeFecId(): boolean {
    return hasFields(this.formFields, ['committee_fec_id']);
  }
  hasEmployeeFields(): boolean {
    return hasFields(this.formFields, EMPLOYEE_INFO_FIELDS);
  }
  hasCandidateOffice(): boolean {
    return hasFields(this.formFields, CANDIDATE_OFFICE_FIELDS);
  }
  hasLoanFinanceFields(): boolean {
    return hasFields(this.formFields, LOAN_FINANCE_FIELDS);
  }
  hasLoanTermsFields(): boolean {
    return hasFields(this.formFields, LOAN_TERMS_FIELDS);
  }
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
  payment_to_date: string;
  due_date: string;
  interest_rate: string;
  secured: string;
  aggregate: string;
  purpose_description: string;
  text4000: string;
  category_code: string;
  election_code: string;
  election_other_description: string;
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
