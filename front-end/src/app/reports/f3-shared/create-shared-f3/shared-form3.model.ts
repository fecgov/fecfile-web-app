import { CommitteeStore } from 'app/committee/committee.store';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { F3FormTypes, Form3 } from 'app/shared/models/reports/form-3.model';
import { F3xFormTypes, Form3X } from 'app/shared/models/reports/form-3x.model';
import {
  getCoverageDates,
  getReportCodes,
  ReportCodes,
  type FilingFrequency,
} from 'app/shared/utils/report-code.utils';
import type { Coverage, ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';

const currentYear = new Date().getFullYear();
export const fieldsToValidate: string[] = [
  'filing_frequency',
  'report_type_category',
  'report_code',
  'coverage_from_date',
  'coverage_through_date',
  'date_of_election',
  'state_of_election',
  'form_type',
] as const;

export enum ReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
}

export interface SharedForm3Model {
  filingFrequency: FilingFrequency | null;
  reportTypeCategory: ReportTypeCategories | null;
  reportCode: ReportCodes | null;
  coverage: Coverage;
  electionReport: {
    date: Date | null;
    state: string | null;
  };
  electionCycle: ElectionCycle | null;
  nextElectionCycle: ElectionCycle | null;
}

export function createInitialModel(
  report: BaseForm3 | null | undefined,
  isF3X: boolean,
  usedReportCodes: ReportCodes[],
  committeeStore: CommitteeStore,
): SharedForm3Model {
  const defaultState = committeeStore.committee()?.candidate_state ?? null;
  if (report) return editFormModel(report, isF3X, defaultState);
  const defaultFilingFrequency = isF3X && committeeStore.filingFrequency() === 'M' ? 'M' : 'Q';
  return createFormModel(defaultFilingFrequency, defaultState, isF3X, usedReportCodes);
}

function createFormModel(
  filingFrequency: FilingFrequency,
  state: string | null,
  isF3X: boolean,
  usedReportCodes: ReportCodes[],
): SharedForm3Model {
  const reportTypeCategory = getDefaultTypeCategory();
  const isElectionYear = reportTypeCategory === ReportTypeCategories.ELECTION_YEAR;
  const reportCodes = getReportCodes(isElectionYear, filingFrequency, isF3X);
  const reportCode = getDefaultReportCode(reportCodes, usedReportCodes);
  const [startDate = null, endDate = null] =
    getCoverageDates(reportCode, currentYear, isElectionYear, filingFrequency) ?? [];
  return {
    filingFrequency,
    reportTypeCategory,
    reportCode,
    coverage: { startDate, endDate },
    electionReport: {
      date: null,
      state,
    },
    electionCycle: null,
    nextElectionCycle: null,
  };
}

function editFormModel(report: BaseForm3, isF3X: boolean, defaultState: string | null): SharedForm3Model {
  return {
    filingFrequency: isF3X && (report as Form3X).filing_frequency === 'M' ? 'M' : 'Q',
    reportTypeCategory: report.report_type_category as ReportTypeCategories,
    reportCode: report.report_code as ReportCodes,
    coverage: {
      startDate: report.coverage_from_date ?? null,
      endDate: report.coverage_through_date ?? null,
    },
    electionReport: {
      date: report.date_of_election ?? null,
      state: report.state_of_election ?? defaultState,
    },
    electionCycle: (report as Form3).electionCycle ?? null,
    nextElectionCycle: (report as Form3).nextElectionCycle ?? null,
  };
}

export function getDefaultReportCode(reportCodes: ReportCodes[], usedReportCodes: ReportCodes[]) {
  return reportCodes.find((code) => !usedReportCodes.includes(code)) ?? null;
}

/**
 * FECFILE-2500
 * ELECTION YEAR
 *   current date is between Feb 1 – Dec 31 of an even-numbered year
 *   current date is between Jan 1 – Jan 31 of an odd-numbered year
 *
 * NON-ELECTION YEAR
 *   current date is between Feb 1 – Dec 31 of an odd-numbered year
 *   current date is between Jan 1 – Jan 31 of an even-numbered year
 * @returns F3xReportTypeCategories
 */
function getDefaultTypeCategory() {
  const isEvenYear = currentYear % 2 === 0;
  const isJanuary = new Date().getMonth() === 0;
  return (isEvenYear && isJanuary) || (!isEvenYear && !isJanuary)
    ? ReportTypeCategories.NON_ELECTION_YEAR
    : ReportTypeCategories.ELECTION_YEAR;
}

export function buildJson(report: BaseForm3, formValue: SharedForm3Model, isF3X: boolean, hasElectionReport: boolean) {
  if (isF3X) (report as Form3X).filing_frequency = formValue.filingFrequency!;
  else {
    (report as Form3).electionCycle = formValue.electionCycle!;
    (report as Form3).nextElectionCycle = formValue.nextElectionCycle;
  }
  report.report_type_category = formValue.reportTypeCategory!;
  report.report_code = formValue.reportCode!;
  if (report.report_code === ReportCodes.TER) {
    report.form_type = isF3X ? F3xFormTypes.F3XT : F3FormTypes.F3T;
  }
  report.coverage_from_date = formValue.coverage.startDate!;
  report.coverage_through_date = formValue.coverage.endDate!;
  report.date_of_election = hasElectionReport ? formValue.electionReport.date! : undefined;
  report.state_of_election = hasElectionReport ? formValue.electionReport.state! : undefined;
  return report;
}
