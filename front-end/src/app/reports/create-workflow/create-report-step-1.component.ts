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
  selector: 'app-create-report-step-1',
  templateUrl: './create-report-step-1.component.html',
})
export class CreateReportStep1 implements OnInit {
  Math = Math;
  committeeAccountSub: Subscription | null = null;
  filingFrequency: string | null = null;
  selectedReportTypeCategory: any = null;
  selectedReportType: any = null;
  coveringPeriodStart: Date = new Date();
  coveringPeriodEnd: Date = new Date();
  electionDate: Date = new Date();
  state: string | null = null;
  stateOptions: PrimeOptions = [];
  formSubmitted = false;

  f3xReportCodeLabels: LabelList = F3xReportCodeLabels;

  reportTypeCategories: F3xReportTypeCategoryType[] = [
    F3xReportTypeCategories.QUARTERLY_REPORTS,
    F3xReportTypeCategories.MONTHLY_REPORTS,
    F3xReportTypeCategories.TWELVE_DAY_PRE_ELECTION_REPORT,
    F3xReportTypeCategories.THIRTY_DAY_POST_ELECTION_REPORT,
    F3xReportTypeCategories.TERMINATION_REPORT,
  ];

  monthlyReportCodes: F3xReportCode[] = [
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
  ];

  quarterlyReportCodes: F3xReportCode[] = [
    F3xReportCodes.Q1,
    F3xReportCodes.Q2,
    F3xReportCodes.Q3,
    F3xReportCodes.YE,
    F3xReportCodes.MY,
  ];

  twelveDayPreElectionReportCodes: F3xReportCode[] = [
    F3xReportCodes.TwelveP,
    F3xReportCodes.TwelveC,
    F3xReportCodes.TwelveG,
    F3xReportCodes.TwelveS,
    F3xReportCodes.TwelveR,
  ];

  thirtyDayPostElectionReportCodes: F3xReportCode[] = [
    F3xReportCodes.ThirtyG,
    F3xReportCodes.ThirtyR,
    F3xReportCodes.ThirtyS,
  ];

  readonly F3xReportTypeCategories = F3xReportTypeCategories;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.committeeAccountSub = this.store.select(selectCommitteeAccount).subscribe((committeeAccount) => {
      this.filingFrequency = committeeAccount.filing_frequency;
      if (this.filingFrequency === 'M') {
        this.selectedReportTypeCategory = F3xReportTypeCategories.MONTHLY_REPORTS;
      }
      if (this.filingFrequency === 'Q') {
        this.selectedReportTypeCategory = F3xReportTypeCategories.QUARTERLY_REPORTS;
      }
      this.selectedReportTypeCategory = this.reportTypeCategories[0];
    });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  }

  ngOnDestroy(): void {
    this.committeeAccountSub?.unsubscribe();
  }

  public getReportTypes() {
    if (this.selectedReportTypeCategory === F3xReportTypeCategories.MONTHLY_REPORTS) {
      return this.monthlyReportCodes;
    }
    if (this.selectedReportTypeCategory === F3xReportTypeCategories.QUARTERLY_REPORTS) {
      return this.quarterlyReportCodes;
    }
    if (this.selectedReportTypeCategory === F3xReportTypeCategories.TWELVE_DAY_PRE_ELECTION_REPORT) {
      return this.twelveDayPreElectionReportCodes;
    }
    if (this.selectedReportTypeCategory === F3xReportTypeCategories.THIRTY_DAY_POST_ELECTION_REPORT) {
      return this.thirtyDayPostElectionReportCodes;
    }
    return [];
  }

  public isElectionReport() {
    return [
      F3xReportTypeCategories.TWELVE_DAY_PRE_ELECTION_REPORT,
      F3xReportTypeCategories.THIRTY_DAY_POST_ELECTION_REPORT,
    ].includes(this.selectedReportTypeCategory);
  }
}

export enum F3xReportTypeCategories {
  QUARTERLY_REPORTS = 'Quarterly Reports',
  MONTHLY_REPORTS = 'Monthly Reports',
  TWELVE_DAY_PRE_ELECTION_REPORT = '12-Day Pre-Election Report',
  THIRTY_DAY_POST_ELECTION_REPORT = '30-Day Post-Election Report',
  TERMINATION_REPORT = 'Termination Report',
}

export type F3xReportTypeCategoryType =
  | F3xReportTypeCategories.QUARTERLY_REPORTS
  | F3xReportTypeCategories.MONTHLY_REPORTS
  | F3xReportTypeCategories.TWELVE_DAY_PRE_ELECTION_REPORT
  | F3xReportTypeCategories.THIRTY_DAY_POST_ELECTION_REPORT
  | F3xReportTypeCategories.TERMINATION_REPORT;
