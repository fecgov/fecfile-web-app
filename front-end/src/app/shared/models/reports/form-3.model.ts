import { Exclude, Expose, plainToInstance, Transform,  } from 'class-transformer';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { ScheduleCTransactionTypes } from '../schc-transaction.model';
import { ScheduleDTransactionTypes } from '../schd-transaction.model';
import { ScheduleFTransactionTypes } from '../schf-transaction.model';
import { TransactionTypes } from '../transaction.model';
import { BaseForm3 } from './base-form-3';
import { ReportTypes } from './report.model';
import { ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';
import { createEmptyLines, F3LineCode, F3LineCodes, Lines, transformLines } from './lines.model';

export const F3FormTypes = {
  F3N: 'F3N',
  F3A: 'F3A',
  F3T: 'F3T',
} as const;
export type F3FormTypes = (typeof F3FormTypes)[keyof typeof F3FormTypes];

export class Form3 extends BaseForm3 {
  schema = f3Schema;
  report_type = ReportTypes.F3;
  form_type: F3FormTypes = F3FormTypes.F3N;
  election_state: string | undefined;
  election_district: string | undefined;

  @Expose({ name: 'election_cycle' })
  electionCycleId!: string;

  @Expose({ name: 'next_election_cycle' })
  nextElectionCycleId: string | null = null;

  @Exclude()
  electionCycle?: ElectionCycle;

  @Exclude()
  nextElectionCycle?: ElectionCycle | null;

  @Expose()
  @Transform(({ obj }) => transformLines<F3LineCode>(obj, 'period'), { toClassOnly: true })
  period = new Lines();

  @Expose()
  @Transform(({ obj }) => transformLines<F3LineCode>(obj, 'ytd'), { toClassOnly: true })
  ytd = new Lines();

  electionCycleCalculations = createEmptyLines<F3LineCode>(F3LineCodes);

  @Exclude()
  override transactionTypes: TransactionTypes[] = [
    // RECEIPTS
    // CONTRIBUTIONS FROM INDIVIDUALS/PERSONS
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECEIPT,
    ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_RECEIPT,
    ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
    ScheduleATransactionTypes.EARMARK_RECEIPT,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN,
    // CONTRIBUTIONS FROM REGISTERED FILERS
    ScheduleATransactionTypes.PARTY_RECEIPT,
    ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PARTY_RETURN,
    ScheduleATransactionTypes.PAC_RECEIPT,
    ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
    ScheduleATransactionTypes.PAC_RETURN,
    ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE,
    ScheduleATransactionTypes.IN_KIND_CONTRIBUTION_FROM_CANDIDATE,
    // TRANSFERS
    ScheduleATransactionTypes.AUTHORIZED_COMMITTEE_TRANSFER,
    ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
    ScheduleATransactionTypes.IN_KIND_TRANSFER,
    // OTHER
    ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    ScheduleATransactionTypes.OTHER_RECEIPTS,
    ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.FEDERAL_COMMITTEE_RECOUNT_DONATION,
    ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.UNREGISTERED_RECOUNT_DONATION_FROM_ORGANIZATION,

    // LOANS AND DEBTS
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
    ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
    ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
    ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
    // DISBURSEMENTS
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
    ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_FEDERAL_CANDIDATE_CONTRIBUTION,
    ScheduleBTransactionTypes.OTHER_FEDERAL_COMMITTEE_CONTRIBUTION,
    ScheduleBTransactionTypes.UNREGISTERED_ORGANIZATION_CONTRIBUTION,
    ScheduleBTransactionTypes.DISGORGEMENT,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION_VOID,
    ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION_VOID,
  ];

  get formLabel() {
    return 'Form 3';
  }

  static fromJSON(json: unknown): Form3 {
    return plainToInstance(Form3, json);
  }
}

export function isForm3S(report: Form3): boolean {
  return report.nextElectionCycle !== null;
}
