import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Report } from 'app/shared/interfaces/report.interface';
import {
  ScheduleATransactionGroups,
  ScheduleATransactionGroupsType,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from 'app/shared/models/scha-transaction.model';
import {
  ScheduleBTransactionGroups,
  ScheduleBTransactionGroupsType,
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from 'app/shared/models/schb-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';
import { getTransactionTypeClass } from 'app/shared/utils/transaction-type.utils';

type Categories = 'receipt' | 'disbursement';
type GroupsTypes = ScheduleATransactionGroupsType | ScheduleBTransactionGroupsType;
type TransactionTypes = ScheduleATransactionTypes | ScheduleBTransactionTypes;

@Component({
  selector: 'app-transaction-type-picker',
  templateUrl: './transaction-type-picker.component.html',
  styleUrls: ['./transaction-type-picker.component.scss'],
})
export class TransactionTypePickerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  transactionTypeLabels: LabelList = [...ScheduleATransactionTypeLabels, ...ScheduleBTransactionTypeLabels];
  report: Report | undefined;
  category: Categories = 'receipt';
  groups: ScheduleATransactionGroupsType[] | ScheduleBTransactionGroupsType[] = [];

  constructor(private store: Store, private route: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.category = params['category'];
      this.titleService.setTitle('Add a ' + this.category);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTransactionGroups(): GroupsTypes[] {
    if (this.category == 'disbursement') {
      return [
        ScheduleBTransactionGroups.OPERATING_EXPENDITURES,
        ScheduleBTransactionGroups.CONTRIBUTIONS_EXPENDITURES_TO_REGULAR_FILERS,
        ScheduleBTransactionGroups.OTHER_EXPENDITURES,
        ScheduleBTransactionGroups.REFUND,
        ScheduleBTransactionGroups.FEDERAL_ELECTION_ACTIVITY_EXPENDITURES,
      ];
    }
    return [
      ScheduleATransactionGroups.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS,
      ScheduleATransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS,
      ScheduleATransactionGroups.TRANSFERS,
      ScheduleATransactionGroups.REFUNDS,
      ScheduleATransactionGroups.OTHER,
    ];
  }

  getTransactionTypes(group: GroupsTypes): TransactionTypes[] {
    switch (group) {
      case ScheduleATransactionGroups.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS:
        return [
          ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
          ScheduleATransactionTypes.TRIBAL_RECEIPT,
          ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
          ScheduleATransactionTypes.REATTRIBUTION,
          ScheduleATransactionTypes.IN_KIND_RECEIPT,
          ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
          ScheduleATransactionTypes.EARMARK_RECEIPT,
          ScheduleATransactionTypes.CONDUIT_EARMARK_DEPOSITED,
          ScheduleATransactionTypes.CONDUIT_EARMARK_UNDEPOSITED,
          ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON,
          ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURN,
        ];
      case ScheduleATransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS:
        return [
          ScheduleATransactionTypes.PARTY_RECEIPT,
          ScheduleATransactionTypes.PARTY_IN_KIND,
          ScheduleATransactionTypes.PARTY_RETURN,
          ScheduleATransactionTypes.PAC_RECEIPT,
          ScheduleATransactionTypes.PAC_IN_KIND,
          ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
          ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_DEPOSITED,
          ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_UNDEPOSITED,
          ScheduleATransactionTypes.PAC_RETURN,
        ];
      case ScheduleATransactionGroups.TRANSFERS:
        return [
          ScheduleATransactionTypes.TRANSFER,
          ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
          ScheduleATransactionTypes.IN_KIND_TRANSFER,
          ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ];
      case ScheduleATransactionGroups.REFUNDS:
        return [
          ScheduleATransactionTypes.REFUNDS_OF_CONTRIBUTIONS_TO_REGISTERED_COMMITTEES,
          ScheduleATransactionTypes.REFUNDS_OF_CONTRIBUTIONS_TO_UNREGISTERED_COMMITTEES,
        ];
      case ScheduleATransactionGroups.OTHER:
        return [
          ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
          ScheduleATransactionTypes.OTHER_RECEIPTS,
          ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
          ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
          ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
          ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
          ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
          ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
          ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
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
        ];
      case ScheduleBTransactionGroups.OPERATING_EXPENDITURES:
        return [
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
        ];
      case ScheduleBTransactionGroups.CONTRIBUTIONS_EXPENDITURES_TO_REGULAR_FILERS:
        return [
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
          ScheduleBTransactionTypes.TRANSFER_TO_AFFIILIATES,
          ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
          ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID,
          ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE,
          ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID,
        ];
      case ScheduleBTransactionGroups.OTHER_EXPENDITURES:
        return [
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_ACCOUNT,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_RECOUNT,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_INDIVIDUAL_REFUND,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_REGULAR_REFUND,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_TRIBAL_REFUND,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_INDIVIDUAL_REFUND,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_REGULAR_REFUND,
          ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_TRIBAL_REFUND,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_INDIVIDUAL_REFUND,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_REGULAR_REFUND,
          ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_TRIBAL_REFUND,
        ];
      case ScheduleBTransactionGroups.REFUND:
        return [
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_INDIVIDUAL,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_INDIVIDUAL_VOID,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PARTY,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PARTY_VOID,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PAC,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PAC_VOID,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_NON_FEDERAL,
          ScheduleBTransactionTypes.REFUND_CONTRIBUTION_NON_FEDERAL_VOID,
        ];
      case ScheduleBTransactionGroups.FEDERAL_ELECTION_ACTIVITY_EXPENDITURES:
        return [
          ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
          ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
          ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
          ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
          ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
        ];
      default:
        return [];
    }
  }

  isTransactionDisabled(transactionTypeIdentifier: string): boolean {
    return !getTransactionTypeClass(transactionTypeIdentifier);
  }

  getRouterLink(transactionType: string): string | undefined {
    if (this.report && !this.isTransactionDisabled(transactionType)) {
      return `/transactions/report/${this.report?.id}}/create/${transactionType}`;
    }
    return undefined;
  }
}
