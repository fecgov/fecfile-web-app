import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';

import { F3xSummaryService } from '../../shared/services/f3x-summary.service';
import { F3xReportCodes, F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xReportCode, F3xReportCodeLabels } from 'app/shared/models/f3x-summary.model';
import { LabelList, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-create-report-step1',
  templateUrl: './create-report-step1.component.html',
})
export class CreateReportStep1 implements OnInit {
  Math = Math;
  committeeAccountSub: Subscription | null = null;
  filingFrequency: string | null = null;
  selectedReportTypeCategory: any = null;
  selectedReportCode: any = undefined;
  coveringPeriodStart: Date = new Date();
  coveringPeriodEnd: Date = new Date();
  electionDate: Date = new Date();
  state: string | null = null;
  stateOptions: PrimeOptions = [];
  formSubmitted = false;

  f3xReportCodeLabels: LabelList = F3xReportCodeLabels;

  monthlyElectionYearReportCodes: F3xReportCode[] = [
    F3xReportCodes.M2,
    F3xReportCodes.M3,
    F3xReportCodes.M4,
    F3xReportCodes.M5,
    F3xReportCodes.M6,
    F3xReportCodes.M7,
    F3xReportCodes.M8,
    F3xReportCodes.M9,
    F3xReportCodes.M10,
    F3xReportCodes.TwelveG,
    F3xReportCodes.ThirtyG,
    F3xReportCodes.YE,
    F3xReportCodes.TER,
  ];

  monthlyNonElectionYearReportCodes: F3xReportCode[] = [
    F3xReportCodes.M2,
    F3xReportCodes.M3,
    F3xReportCodes.M4,
    F3xReportCodes.M5,
    F3xReportCodes.M6,
    F3xReportCodes.M7,
    F3xReportCodes.M8,
    F3xReportCodes.M9,
    F3xReportCodes.M10,
    F3xReportCodes.M11,
    F3xReportCodes.M12,
    F3xReportCodes.YE,
    F3xReportCodes.TER,
  ];

  quarterlyElectionYearReportCodes: F3xReportCode[] = [
    F3xReportCodes.Q1,
    F3xReportCodes.Q2,
    F3xReportCodes.Q3,
    F3xReportCodes.YE,
    F3xReportCodes.TwelveG,
    F3xReportCodes.ThirtyG,
    F3xReportCodes.TER,
  ];
  quarterlyNonElectionYearReportCodes: F3xReportCode[] = [F3xReportCodes.MY, F3xReportCodes.YE, F3xReportCodes.TER];

  quarterlySpecialReportCodes: F3xReportCode[] = [
    F3xReportCodes.TwelveP,
    F3xReportCodes.TwelveR,
    F3xReportCodes.TwelveC,
    F3xReportCodes.TwelveS,
    F3xReportCodes.ThirtyR,
    F3xReportCodes.ThirtyS,
  ];

  readonly F3xReportTypeCategories = F3xReportTypeCategories;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.committeeAccountSub = this.store.select(selectCommitteeAccount).subscribe((committeeAccount) => {
      this.filingFrequency = 'M'; //committeeAccount.filing_frequency;
      this.selectedReportTypeCategory = this.getReportTypeCategories()[0];
      this.selectedReportCode = this.getReportCodes()[0];
    });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  }

  ngOnDestroy(): void {
    this.committeeAccountSub?.unsubscribe();
  }

  public onReportTypeCategoryChange(): void {
    this.selectedReportCode = this.getReportCodes()[0];
  }

  public getReportTypeCategories(): F3xReportTypeCategoryType[] {
    if (this.filingFrequency === 'M') {
      return [F3xReportTypeCategories.ELECTION_YEAR, F3xReportTypeCategories.NON_ELECTION_YEAR];
    }
    return [
      F3xReportTypeCategories.ELECTION_YEAR,
      F3xReportTypeCategories.NON_ELECTION_YEAR,
      F3xReportTypeCategories.SPECIAL,
    ];
  }

  public getReportCodes(): F3xReportCode[] {
    const isMonthly = this.filingFrequency === 'M';
    switch (this.selectedReportTypeCategory) {
      case F3xReportTypeCategories.ELECTION_YEAR:
        return isMonthly ? this.monthlyElectionYearReportCodes : this.quarterlyElectionYearReportCodes;
      case F3xReportTypeCategories.NON_ELECTION_YEAR:
        return isMonthly ? this.monthlyNonElectionYearReportCodes : this.quarterlyNonElectionYearReportCodes;
      case F3xReportTypeCategories.SPECIAL:
        return isMonthly ? [] : this.quarterlySpecialReportCodes;
      default:
        return [];
    }
  }

  public isElectionReport() {
    return [
      F3xReportCodes.ThirtyG,
      F3xReportCodes.ThirtyR,
      F3xReportCodes.ThirtyS,
      F3xReportCodes.TwelveC,
      F3xReportCodes.TwelveG,
      F3xReportCodes.TwelveP,
      F3xReportCodes.TwelveR,
      F3xReportCodes.TwelveS,
    ].includes(this.selectedReportCode);
  }
}

export enum F3xReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
  SPECIAL = 'Special',
}

export type F3xReportTypeCategoryType =
  | F3xReportTypeCategories.ELECTION_YEAR
  | F3xReportTypeCategories.NON_ELECTION_YEAR
  | F3xReportTypeCategories.SPECIAL;
