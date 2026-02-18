import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from '../models/schb-transaction.model';
import { ScheduleCTransactionTypes } from '../models/schc-transaction.model';
import { ScheduleFTransactionTypes } from '../models/schf-transaction.model';
import { ScheduleIds, ScheduleTransaction, TransactionTypes } from '../models/transaction.model';
import type { TransactionType } from '../models/transaction-type.model';

export class TransactionTypeUtils {
  static async factory(transactionTypeIdentifier: string): Promise<TransactionType> {
    const transactionType = await getTransactionTypeClass(transactionTypeIdentifier);
    if (!transactionType) {
      throw new Error(`FECfile+: Class transaction type of '${transactionTypeIdentifier}' is not found`);
    }
    return new transactionType();
  }
}

export async function getTransactionTypeClass(transactionTypeIdentifier: string): Promise<any> {
  try {
    const module = await import(`../models/transaction-types/${transactionTypeIdentifier}.model.ts`);
    return module[transactionTypeIdentifier];
  } catch (error) {
    console.error(`Failed to load transaction type: ${transactionTypeIdentifier}`, error);
    return null;
  }
}

// prettier-ignore
/**
 * Returns a schedule object of the correct class as discovered by examining
 * the scheduleId of the transaction type.
 *
 * This function is in this file because there is a REFERENCEERROR when it
 * is included in the transaction.model.ts file
 * @param json
 * @param depth
 * @returns
 */
export async function getFromJSON(json: any, depth = 2): Promise<ScheduleTransaction> { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (json.line_label) json.line_label = json.line_label.replace(/^0+/, '');

  const transactionType = json.transaction_type_identifier ? await TransactionTypeUtils.factory(json.transaction_type_identifier) : undefined;
  return getfromJsonByType(json, transactionType, depth);
}

export function PTY_ONLY(): Set<TransactionTypes> {
  return new Set([
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
    ScheduleBTransactionTypes.PAC_IN_KIND_OUT,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
  ]);
}

export function PAC_ONLY(): Set<TransactionTypes> {
  return new Set([
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
  ]);
}

export function MultipleEntryTransactionTypes(): string[] {
  return [
    ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    ScheduleATransactionTypes.IN_KIND_TRANSFER,
    ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
    ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
    ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
  ];
}

async function getfromJsonByType(
  json: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  transactionType: TransactionType | undefined,
  depth: number,
): Promise<ScheduleTransaction> {
  if (transactionType) {
    switch (transactionType.scheduleId) {
      case ScheduleIds.A: {
        return (await import('../models/scha-transaction.model')).SchATransaction.fromJSON(json, depth);
      }
      case ScheduleIds.B: {
        return (await import('../models/schb-transaction.model')).SchBTransaction.fromJSON(json, depth);
      }
      case ScheduleIds.C: {
        return (await import('../models/schc-transaction.model')).SchCTransaction.fromJSON(json, depth);
      }
      case ScheduleIds.C1: {
        return (await import('../models/schc1-transaction.model')).SchC1Transaction.fromJSON(json, depth);
      }
      case ScheduleIds.C2: {
        return (await import('../models/schc2-transaction.model')).SchC2Transaction.fromJSON(json, depth);
      }
      case ScheduleIds.D: {
        return (await import('../models/schd-transaction.model')).SchDTransaction.fromJSON(json, depth);
      }
      case ScheduleIds.E: {
        return (await import('../models/sche-transaction.model')).SchETransaction.fromJSON(json, depth);
      }
      case ScheduleIds.F: {
        return (await import('../models/schf-transaction.model')).SchFTransaction.fromJSON(json, depth);
      }
    }
  }
  return SchATransaction.fromJSON(json, depth); // Until 404 resolved
}
