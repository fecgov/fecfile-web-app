import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
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
export class TransactionTypePickerComponent implements OnInit {
  scheduleATransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels;
  report: F3xSummary | undefined;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.report = this.activatedRoute.snapshot.data['report'];
  }

  getTransactionGroups(): ScheduleATransactionGroupsType[] {
    return [
      ScheduleATransactionGroups.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS,
      ScheduleATransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS,
      ScheduleATransactionGroups.TRANSFER,
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
          ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT,
        ];
      case ScheduleATransactionGroups.TRANSFER:
        return [
          ScheduleATransactionTypes.TRANSFERS,
          ScheduleATransactionTypes.JF_TRANSFERS,
          ScheduleATransactionTypes.IN_KIND_TRANSFER,
          ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ];
      case ScheduleATransactionGroups.REFUNDS:
        return [
          ScheduleATransactionTypes.TRANSFERS,
          ScheduleATransactionTypes.JF_TRANSFERS,
          ScheduleATransactionTypes.IN_KIND_TRANSFER,
          ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ];
      case ScheduleATransactionGroups.OTHER:
        return [
          ScheduleATransactionTypes.TRANSFERS,
          ScheduleATransactionTypes.JF_TRANSFERS,
          ScheduleATransactionTypes.IN_KIND_TRANSFER,
          ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
          ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ];
      default:
        return [];
    }
  }
}
