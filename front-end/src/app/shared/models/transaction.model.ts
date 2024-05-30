import { BaseModel } from './base.model';
import { Contact, ContactTypes } from './contact.model';
import { MemoText } from './memo-text.model';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionGroupsType } from './scha-transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionGroupsType } from './schb-transaction.model';
import { SchCTransaction, ScheduleCTransactionTypes, ScheduleCTransactionGroupsType } from './schc-transaction.model';
import { TransactionType } from './transaction-type.model';
import { Exclude, Type } from 'class-transformer';
import { SchemaUtils } from '../utils/schema.utils';
import {
  SchC1Transaction,
  ScheduleC1TransactionGroupsType,
  ScheduleC1TransactionTypes,
} from './schc1-transaction.model';
import {
  SchC2Transaction,
  ScheduleC2TransactionGroupsType,
  ScheduleC2TransactionTypes,
} from './schc2-transaction.model';
import { SchDTransaction, ScheduleDTransactionGroupsType, ScheduleDTransactionTypes } from './schd-transaction.model';
import { SchETransaction, ScheduleETransactionGroupsType, ScheduleETransactionTypes } from './sche-transaction.model';
import { Report, ReportTypes } from './report.model';
import { Form3X } from './form-3x.model';
import { Form24 } from './form-24.model';

export abstract class Transaction extends BaseModel {
  id: string | undefined;

  @Type(() => TransactionType)
  @Exclude({ toPlainOnly: true })
  transactionType: TransactionType = {} as TransactionType;

  // FECFile spec properties

  form_type: string | undefined;
  transaction_id: string | undefined;

  // FECFile Online custom properties

  transaction_type_identifier: string | undefined;
  force_unaggregated: boolean | undefined;
  itemized: boolean | undefined;
  force_itemized: boolean | undefined;

  parent_transaction: Transaction | undefined;
  parent_transaction_id: string | undefined; // Foreign key to the parent transaction db record

  debt: Transaction | undefined;
  debt_id: string | undefined; // Foreign key to debt which this transaction repays

  loan: Transaction | undefined;
  loan_id: string | undefined; // Foreign key to loan which this transaction repays

  reatt_redes: Transaction | undefined;
  reatt_redes_id: string | undefined; // Foreign key to original reattribution/redesignation transaction

  created: string | undefined;
  updated: string | undefined;
  deleted: string | undefined;

  reports: Report[] | undefined;
  report_ids: string[] | undefined;

  @Type(() => Contact)
  contact_1: Contact | undefined;
  contact_1_id: string | undefined; // Foreign key to the Contact db record

  @Type(() => Contact)
  contact_2: Contact | undefined;
  contact_2_id: string | undefined; // Foreign key to the Contact db record

  @Type(() => Contact)
  contact_3: Contact | undefined;
  contact_3_id: string | undefined; // Foreign key to the Contact db record

  @Type(() => MemoText)
  memo_text: MemoText | undefined;
  memo_text_id: string | undefined;

  children: Transaction[] = [];
  loan_agreement_id?: string;

  fields_to_validate: string[] | undefined; // Fields to run through validation in the API when creating or updating a transaction
  getFieldsNotToValidate(): string[] {
    return ['transaction_id', 'filer_committee_id_number'];
  }

  schema_name: string | undefined;

  line_label?: string;

  /**
   * Some fields, such as ones in the spec but calculated by the backend, are listed
   * here so we don't try to save them to the database in the backend.
   * @returns list of property fields of the model not to send to the backend and not saved to the database
   */
  getFieldsNotToSave(): string[] {
    return [];
  }

  /**
   * Perform bookkeeping updates to the transaction when it is created via fromJSON()
   * We have to pass the transactionType instead of getting from TransactonTypeUtils
   * in the method because that throw the error:
   *  Uncaught ReferenceError: Cannot access 'Transaction' before initialization
   * @param transactionType
   */
  setMetaProperties(transactionType: TransactionType): void {
    this.contact_1_id = this.contact_1?.id;
    this.contact_2_id = this.contact_2?.id;
    this.contact_3_id = this.contact_3?.id;
    this.transactionType = transactionType;
    this.schema_name = transactionType.getSchemaName();
    if (!this.fields_to_validate) {
      const fieldsToValidate: string[] = SchemaUtils.getSchemaProperties(transactionType.schema);
      const fieldsNotToValidate: string[] = this.getFieldsNotToValidate();
      this.fields_to_validate = fieldsToValidate.filter((p) => ![...fieldsNotToValidate].includes(p));
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
    const outChildren: Transaction[] = [];
    if (this.children) {
      for (const child of this.children as SchATransaction[]) {
        // Modify the purpose description this to reflect the changes to child transactions
        if (child?.transactionType?.generatePurposeDescription) {
          child.parent_transaction = this;
          const newDescrip = child.transactionType.generatePurposeDescriptionWrapper(child);
          const key = child.transactionType.templateMap.purpose_description as keyof ScheduleTransaction;
          ((child as ScheduleTransaction)[key] as string) = newDescrip;
          child.updateChildren();
        }
        outChildren.push(child);
      }
    }
    return outChildren;
  }

  /**
   * Returns a transaction payload with the parent of the original payload
   * swapped in as the main payload and the original main payload is a child
   * @returns
   */
  getUpdatedParent(childDeleted = false): Transaction {
    if (!this.parent_transaction?.transaction_type_identifier) {
      throw new Error(
        `Fecfile: Child transaction '${this.transaction_type_identifier}' is missing its parent when saving to API`,
      );
    }

    // The parent is the new payload
    const payload = this.parent_transaction;
    if (!payload.children) payload.children = [];

    // Attach the original payload to the parent as a child, replacing an
    // existing version if needed
    if (this.id) {
      payload.children = payload.children.filter((c) => c.id !== this.id);
    }
    if (!childDeleted) {
      payload.children.push(this);
    }
    payload.children = payload.updateChildren();

    // Update the purpose description
    if (payload.transactionType?.generatePurposeDescription) {
      const key = payload.transactionType.templateMap.purpose_description as keyof ScheduleTransaction;
      ((payload as ScheduleTransaction)[key] as string) =
        payload.transactionType.generatePurposeDescriptionWrapper(payload);
    }

    return payload;
  }

  getReport(reportType?: ReportTypes): Report | void {
    if (this.reports) {
      for (const report of this.reports) {
        if (report.report_type === reportType) {
          return report;
        }
      }
    }
  }

  getForm3X(): Form3X | undefined {
    return (this.getReport(ReportTypes.F3X) as Form3X) ?? undefined;
  }

  getForm24(): Form24 | undefined {
    return (this.getReport(ReportTypes.F24) as Form24) ?? undefined;
  }
}

export function getTransactionName(transaction: ScheduleTransaction): string {
  if (transaction.entity_type === ContactTypes.INDIVIDUAL) {
    const firstName = transaction[
      transaction.transactionType.templateMap.first_name as keyof ScheduleTransaction
    ] as string;
    const lastName = transaction[
      transaction.transactionType.templateMap.last_name as keyof ScheduleTransaction
    ] as string;
    return `${lastName}, ${firstName}`;
  }

  const orgName = transaction[
    transaction.transactionType.templateMap.organization_name as keyof ScheduleTransaction
  ] as string;
  return orgName;
}
export function isNewTransaction(transaction?: Transaction): boolean {
  return !transaction?.id;
}
export function hasNoContact(transaction?: Transaction): boolean {
  return !transaction?.contact_1;
}
export function isExistingTransaction(transaction?: Transaction): boolean {
  return !!transaction?.id;
}
export function isPulledForwardLoan(transaction?: Transaction): boolean {
  return !!transaction?.loan_id && transaction.transactionType.scheduleId === ScheduleIds.C;
}
export function isLoanRepayment(transaction?: Transaction): boolean {
  return !!transaction?.loan_id && transaction.transactionType.scheduleId !== ScheduleIds.C;
}
export function isDebtRepayment(transaction?: Transaction): boolean {
  return !!transaction?.debt_id && transaction.transactionType.scheduleId !== ScheduleIds.D;
}

export type ScheduleTransaction =
  | SchATransaction
  | SchBTransaction
  | SchCTransaction
  | SchC1Transaction
  | SchC2Transaction
  | SchDTransaction
  | SchETransaction;
export type TransactionTypes =
  | ScheduleATransactionTypes
  | ScheduleBTransactionTypes
  | ScheduleCTransactionTypes
  | ScheduleC1TransactionTypes
  | ScheduleC2TransactionTypes
  | ScheduleDTransactionTypes
  | ScheduleETransactionTypes;
export type TransactionGroupTypes =
  | ScheduleATransactionGroupsType
  | ScheduleBTransactionGroupsType
  | ScheduleCTransactionGroupsType
  | ScheduleC1TransactionGroupsType
  | ScheduleC2TransactionGroupsType
  | ScheduleDTransactionGroupsType
  | ScheduleETransactionGroupsType;

export enum AggregationGroups {
  GENERAL = 'GENERAL',
  LINE_14 = 'LINE_14',
  LINE_15 = 'LINE_15',
  LINE_16 = 'LINE_16',
  NATIONAL_PARTY_CONVENTION_ACCOUNT = 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  NATIONAL_PARTY_RECOUNT_ACCOUNT = 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  NON_CONTRIBUTION_ACCOUNT = 'NON_CONTRIBUTION_ACCOUNT',
  OTHER_RECEIPTS = 'OTHER_RECEIPTS',
  RECOUNT_ACCOUNT = 'RECOUNT_ACCOUNT',
  GENERAL_DISBURSEMENT = 'GENERAL_DISBURSEMENT',
  INDEPENDENT_EXPENDITURE = 'INDEPENDENT_EXPENDITURE',
}

export enum ScheduleIds {
  A = 'A',
  B = 'B',
  C = 'C',
  C1 = 'C1',
  C2 = 'C2',
  D = 'D',
  E = 'E',
}
