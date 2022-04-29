import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';

import { F3xSummaryService } from '../../shared/services/f3x-summary.service';
import { F3xReportCodes, F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xReportCode } from 'app/shared/models/f3x-summary.model';

@Component({
  selector: 'app-report-type',
  templateUrl: './report-type.component.html',
})
export class ReportTypeComponent implements OnInit {
  selectedReportTypeCategory: any = null;
  selectedReportType: any = null;
  coveringPeriodStart: Date = new Date();
  coveringPeriodEnd: Date = new Date();
  formSubmitted = false;

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

  readonly F3xReportTypeCategories = F3xReportTypeCategories;

  ngOnInit() {}

  public getReportTypes() {
    if (this.selectedReportTypeCategory === F3xReportTypeCategories.MONTHLY_REPORTS) {
      return this.monthlyReportCodes;
    }
    if (this.selectedReportTypeCategory === F3xReportTypeCategories.QUARTERLY_REPORTS) {
      return this.quarterlyReportCodes;
    }
    return [];
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
