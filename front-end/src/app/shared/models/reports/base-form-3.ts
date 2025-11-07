import { Exclude, plainToClass, Transform } from 'class-transformer';
import { BaseModel } from '../base.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ScheduleCTransactionTypes } from '../schc-transaction.model';
import { ScheduleDTransactionTypes } from '../schd-transaction.model';
import { Receipt, LoansAndDebts, ReceiptType, LoansAndDebtsType } from '../transaction-group';
import { TransactionTypes } from '../transaction.model';
import { Report, ReportStatus } from './report.model';
import { ReportCodes } from 'app/shared/utils/report-code.utils';

export class CoverageDates {
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  report_code: ReportCodes | undefined;
  report_code_label?: string;

  // prettier-ignore
  static fromJSON(json: any, reportCodeLabel: string): CoverageDates { // eslint-disable-line @typescript-eslint/no-explicit-any
    json.report_code_label = reportCodeLabel;
    return plainToClass(CoverageDates, json);
  }
}

export abstract class BaseForm3 extends Report {
  calculation_status: string | undefined;
  override hasChangeOfAddress = true;
  change_of_address: boolean | undefined;
  election_code: string | undefined;
  @Transform(BaseModel.dateTransform) date_of_election: Date | undefined;
  state_of_election: string | undefined;
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  qualified_committee: boolean | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;

  override get coverageDates(): { [date: string]: Date | undefined } {
    return { coverage_from_date: this.coverage_from_date, coverage_through_date: this.coverage_through_date };
  }

  override get canAmend(): boolean {
    return this.report_status === ReportStatus.SUBMIT_SUCCESS;
  }

  get formSubLabel() {
    return this.report_code_label ?? '';
  }

  @Exclude()
  protected receiptTransactionGroup = [
    Receipt.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS,
    Receipt.CONTRIBUTIONS_FROM_REGISTERED_FILERS,
    Receipt.TRANSFERS,
    Receipt.REFUNDS,
    Receipt.OTHER,
  ];
  @Exclude()
  protected loanTransactionGroup = [LoansAndDebts.LOANS, LoansAndDebts.DEBTS];

  @Exclude()
  protected receiptTransactionMap = new Map<ReceiptType, TransactionTypes[]>([
    [
      Receipt.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS,
      [
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        ScheduleATransactionTypes.TRIBAL_RECEIPT,
        ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
        ScheduleATransactionTypes.IN_KIND_RECEIPT,
        ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
        ScheduleATransactionTypes.EARMARK_RECEIPT,
        ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
        ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY,
        ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN,
      ],
    ],
    [
      Receipt.CONTRIBUTIONS_FROM_REGISTERED_FILERS,
      [
        ScheduleATransactionTypes.PARTY_RECEIPT,
        ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
        ScheduleATransactionTypes.PARTY_RETURN,
        ScheduleATransactionTypes.PAC_RECEIPT,
        ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
        ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
        ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
        ScheduleATransactionTypes.PAC_RETURN,
      ],
    ],
    [
      Receipt.TRANSFERS,
      [
        ScheduleATransactionTypes.TRANSFER,
        ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
        ScheduleATransactionTypes.IN_KIND_TRANSFER,
        ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
        ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      ],
    ],
    [
      Receipt.REFUNDS,
      [
        ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE,
        ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
        ScheduleATransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE,
      ],
    ],
    [
      Receipt.OTHER,
      [
        ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
        ScheduleATransactionTypes.OTHER_RECEIPTS,
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
        ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
        ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
        ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
        ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
        ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
        ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
        ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
        ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
        ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
        ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
        ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      ],
    ],
  ]);

  @Exclude()
  protected loansTransactionMap = new Map<LoansAndDebtsType, TransactionTypes[]>([
    [
      LoansAndDebts.LOANS,
      [
        ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
        ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
        ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
      ],
    ],
    [
      LoansAndDebts.DEBTS,
      [ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE, ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE],
    ],
  ]);
}
