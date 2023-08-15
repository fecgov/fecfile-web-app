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
import { ContactType, STANDARD_SINGLE_CONTACT } from './contact.model';
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
  contactConfig: { [contactKey: string]: { [formField: string]: string } } = STANDARD_SINGLE_CONTACT;
  abstract title: string;
  abstract schema: JsonSchema; // FEC validation JSON schema
  abstract templateMap: TransactionTemplateMapType; // Mapping of values between the schedule (A,B,C...) and the common identifiers in the HTML templates
  abstract getNewTransaction(): Transaction; // Factory method to create a new Transaction object with default property values for this transaction type
  updateParentOnSave = false; // Set to true when the parent transaction may be affected by a change in the transaction
  synchronizeOrgComNameValues = true; // When the COM name value is saved in the ORG model property per the FEC specification, "true" indicates that it is also copied into the COM model property as well

  // Form display settings
  negativeAmountValueOnly = false; // Set to true if the amount for the transaction can only have a negative value
  isRefund = false; // Boolean flag to identify the transaction type as a refund
  showAggregate = true; // Boolean flag to show/hide the calculated aggregate input on the transaction forms
  contact2IsRequired = false; // Boolean flag to cause contact_2 required to be added to the form validation
  contact3IsRequired = false; // Boolean flag to cause contact_3 required to be added to the form validation

  // Double-entry settings
  isDependentChild = false; // When set to true, the parent transaction of the transaction is used to generate UI form entry page
  dependentChildTransactionTypes?: TransactionTypes[]; // For multi-entry transaction forms, this property defines the transaction type of the dependent child transactions
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
  doMemoCodeDateCheck = true; // Flag activates the "Just checking..." pop-up check if the input transaction date is outside of the report date range.

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
  signatoryOneTitle?: string; // Label for the signatory_1 section in the form
  signatoryTwoTitle?: string; // Label for the signatory_2 section in the form

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

  /**
   * Generates a list of fields names for the form controls in a transaction type input component
   * @returns string[] - Array of field names.
   */
  getFormControlNames(): string[] {
    const templateFields = this.formFields
      .map((name: string) => {
        return name in this.templateMap ? this.templateMap[name as TemplateMapKeyType] : name;
      })
      .filter((field) => !!field);
    return ['entity_type', ...templateFields];
  }

  // The following "has*" methods and properties are boolean switches that show/hide
  // a component or section in the transaction type input component
  hasAmountInput = true; // Boolean flag to show/hide the standard amount control.  This is typically hidden if an alternate is used, like in Loans
  hasCandidateCommittee = false; //Boolean flag to show/hide committee inputs along side candidate info
  hasElectionInformation(): boolean {
    return hasFields(this.formFields, ELECTION_FIELDS);
  }
  hasCandidateInformation(): boolean {
    return hasFields(this.formFields, CANDIDATE_FIELDS);
  }
  hasCommitteeOrCandidateInformation(): boolean {
    return hasFields(this.formFields, CANDIDATE_FIELDS) || this.contact3IsRequired;
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
  hasAdditionalInfo = true;
  hasLoanAgreement = false;
  hasSignature1 = false;
  hasSignature2 = false;
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
  secondary_name: string;
  secondary_street_1: string;
  secondary_street_2: string;
  secondary_city: string;
  secondary_state: string;
  secondary_zip: string;
  signatory_1_last_name: string;
  signatory_1_first_name: string;
  signatory_1_middle_name: string;
  signatory_1_prefix: string;
  signatory_1_suffix: string;
  signatory_1_date: string;
  signatory_2_last_name: string;
  signatory_2_first_name: string;
  signatory_2_middle_name: string;
  signatory_2_prefix: string;
  signatory_2_suffix: string;
  signatory_2_title: string;
  signatory_2_date: string;
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
