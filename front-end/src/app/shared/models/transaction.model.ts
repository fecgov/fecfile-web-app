import { BaseModel } from './base.model';
import { Contact } from './contact.model';
import { MemoText } from './memo-text.model';
import { SchATransaction, ScheduleATransactionTypes, ScheduleAFormTemplateMap } from './scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from './schb-transaction.model';
import { ValidateService } from '../services/validate.service';
import { TransactionType } from './transaction-types/transaction-type.model';
import { Type } from 'class-transformer';

/**
 * This is a copy of the same map from the schb-transaction.model.ts file.
 * There is currently a initialization bug when importing this map
 * from the other file. Looking to see if it clears up when the transaction
 * tree is refactored to place TransactionType on the transaction rather
 * than the current viceversa
 */
const ScheduleBFormTemplateMap: ScheduleFormTemplateMapType = {
  last_name: 'payee_last_name',
  first_name: 'payee_first_name',
  middle_name: 'payee_middle_name',
  prefix: 'payee_prefix',
  suffix: 'payee_suffix',
  street_1: 'payee_street_1',
  street_2: 'payee_street_2',
  city: 'payee_city',
  state: 'payee_state',
  zip: 'payee_zip',
  employer: '',
  occupation: '',
  organization_name: 'payee_organization_name',
  committee_fec_id: 'beneficiary_committee_fec_id',
  date: 'expenditure_date',
  memo_code: 'memo_code',
  amount: 'expenditure_amount',
  aggregate: 'aggregate_amount',
  purpose_descrip: 'expenditure_purpose_descrip',
  purposeDescripLabel: 'EXPENDITURE PURPOSE DESCRIPTION',
  memo_text_input: 'memo_text_input',
  category_code: 'category_code',
};

export abstract class Transaction extends BaseModel {
  id: string | undefined;
  transactionType: TransactionType | undefined;

  // FECFile spec properties

  form_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id: string | undefined;

  // FECFile Online custom properties

  transaction_type_identifier: string | undefined;
  itemized: boolean | undefined;

  parent_transaction: Transaction | undefined;
  parent_transaction_id: string | undefined; // Foreign key to the parent transaction db record

  created: string | undefined;
  updated: string | undefined;
  deleted: string | undefined;

  report_id: string | undefined; // Foreign key to the parent report db record

  @Type(() => Contact)
  contact: Contact | undefined;
  contact_id: string | undefined; // Foreign key to the Contact db record

  @Type(() => MemoText)
  memo_text: MemoText | undefined;
  memo_text_id: string | undefined;

  children: Transaction[] | undefined;

  fields_to_validate: string[] | undefined; // Fields to run through validation in the API when creating or updating a transaction
  getFieldsNotToValidate(): string[] {
    return ['transaction_id'];
  }

  schema_name: string | undefined;

  abstract apiEndpoint: string; // Root URL for API endpoint

  abstract getUpdatedParent(childDeleted?: boolean): Transaction; // Method to handle save when child must update parent properties

  /**
   * Perform bookkeeping updates to the transaction when it is created via fromJSON()
   * We have to pass the transactionType instead of getting from TransactonTypeUtils
   * in the method because that throw the error:
   *  Uncaught ReferenceError: Cannot access 'Transaction' before initialization
   * @param transactionType
   */
  setMetaProperties(transactionType: TransactionType): void {
    this.contact_id = this.contact?.id;
    if (this?.transaction_type_identifier) {
      this.transactionType = transactionType;
      this.schema_name = transactionType.getSchemaName();
      const fieldsToValidate: string[] = ValidateService.getSchemaProperties(transactionType.schema);
      const fieldsNotToValidate: string[] = this.getFieldsNotToValidate();
      this.fields_to_validate = fieldsToValidate.filter((p) => ![...fieldsNotToValidate].includes(p));
    } else {
      throw new Error('No TRANSACTION_TYPE_IDENTIFIER found when setting Meta Properties');
    }
  }

  /**
   * updateChildren()
   * @returns
   *    An array of Transaction objects whose contribution_purpose_descriptions
   *    have been re-generated to account for changes to their parent
   *
   */
  updateChildren(): Transaction[] {
    if (this.children) {
      return this.children;
    }
    return [];
  }

  static getFormTemplateMap(transactionType: TransactionType | undefined): ScheduleFormTemplateMapType {
    if (!transactionType) throw new Error('getFormTemplateMap() missing transaction type');
    if (transactionType.scheduleId === 'A') return ScheduleAFormTemplateMap;
    if (transactionType.scheduleId === 'B') return ScheduleBFormTemplateMap;
    throw new Error(`Missing form template map for ${transactionType?.transaction?.transaction_type_identifier}`);
  }
}

export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact;
}

// export type ScheduleTransactionKeys = SchATransaction & SchBTransaction;
export type ScheduleTransaction = SchATransaction | SchBTransaction;
export type ScheduleTransactionTypes = ScheduleATransactionTypes | ScheduleBTransactionTypes;

export type ScheduleFormTemplateMapType = {
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
  date: string;
  memo_code: string;
  amount: string;
  aggregate: string;
  purpose_descrip: string;
  purposeDescripLabel: string;
  memo_text_input: string;
  category_code: string;
};

export enum AggregationGroups {
  GENERAL = 'GENERAL',
  LINE_15 = 'LINE_15',
  LINE_16 = 'LINE_16',
  NATIONAL_PARTY_CONVENTION_ACCOUNT = 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  NATIONAL_PARTY_RECOUNT_ACCOUNT = 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  NON_CONTRIBUTION_ACCOUNT = 'NON_CONTRIBUTION_ACCOUNT',
  OTHER_RECEIPTS = 'OTHER_RECEIPTS',
  RECOUNT_ACCOUNT = 'RECOUNT_ACCOUNT',
  GENERAL_DISBURSEMENT = 'GENERAL_DISBURSEMENT',
}
