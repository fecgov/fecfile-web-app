import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-transaction-type-picker',
  templateUrl: './transaction-type-picker.component.html',
  styleUrls: ['./transaction-type-picker.component.scss'],
})
export class TransactionTypePickerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  scheduleATransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels;
  report: Report | undefined;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTransactionGroups(): ScheduleATransactionGroupsType[] {
    return [
      ScheduleATransactionGroups.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS,
      ScheduleATransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS,
      ScheduleATransactionGroups.TRANSFERS,
      ScheduleATransactionGroups.REFUNDS,
      ScheduleATransactionGroups.OTHER,
    ];
  }

  getTransactionTypes(group: ScheduleATransactionGroupsType): ScheduleATransactionTypes[] {
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
          ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURNED_BOUNCED_RECEIPT,
        ];
      case ScheduleATransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS:
        return [
          ScheduleATransactionTypes.PARTY_RECEIPT,
          ScheduleATransactionTypes.PARTY_IN_KIND,
          ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_PARTY,
          ScheduleATransactionTypes.PAC_RECEIPT,
          ScheduleATransactionTypes.PAC_IN_KIND,
          ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
          ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_DEPOSITED,
          ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_UNDEPOSITED,
          ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_PAC,
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
          ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
          ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
          ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
          ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
          ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
          ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
        ];
      default:
        return [];
    }
  }
}
