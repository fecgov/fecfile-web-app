import type { DateOverlapResponse } from 'app/shared/components/signal-inputs/date-input/date.validators';
import type { FilingFrequency, ReportCodes } from 'app/shared/utils/report-code.utils';
import type { Coverage, ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';
import { MaybeFieldTree } from '@angular/forms/signals';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { Form3 } from 'app/shared/models/reports/form-3.model';
import { DateUtils } from 'app/shared/utils/date.utils';

export enum ReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
}

const year = new Date().getFullYear();

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
  const isEvenYear = year % 2 === 0;
  const isJanuary = new Date().getMonth() === 0;
  return (isEvenYear && isJanuary) || (!isEvenYear && !isJanuary)
    ? ReportTypeCategories.NON_ELECTION_YEAR
    : ReportTypeCategories.ELECTION_YEAR;
}

export function getColumns(codes: ReportCodes[], numColumns: number): ReportCodes[][] {
  const result: ReportCodes[][] = [];
  let startIndex = 0;

  for (let i = 0; i < numColumns; i++) {
    const baseSize = Math.floor(codes.length / numColumns);
    const extra = i < codes.length % numColumns ? 1 : 0;
    const colSize = baseSize + extra;
    const chunk = codes.slice(startIndex, startIndex + colSize);
    result.push(chunk);
    startIndex += colSize;
  }
  return result;
}

interface ReportDateOverlapResponse extends DateOverlapResponse {
  overlapping_reports: {
    report_code_label: string;
    coverage_from_date: string;
    coverage_through_date: string;
  }[];
}

export function mapResponseToErrors(
  response: DateOverlapResponse,
  fields: {
    startField: MaybeFieldTree<Date | null, string>;
    endField: MaybeFieldTree<Date | null, string>;
  },
) {
  const reportResponse = response as ReportDateOverlapResponse;
  const message = getReportOverlapMessage(reportResponse);
  const errors = [];

  if (reportResponse.start_date) {
    errors.push({
      kind: 'overlap',
      message,
      fieldTree: fields.startField,
    });
  }

  if (reportResponse.end_date) {
    errors.push({
      kind: 'overlap',
      message,
      fieldTree: fields.endField,
    });
  }

  return errors.length > 0 ? errors : null;
}

function getReportOverlapMessage(overlap: ReportDateOverlapResponse): string {
  const reports = overlap.overlapping_reports;
  if (reports.length === 0) return '';

  return (
    `You have entered coverage dates that overlap ` +
    `the coverage dates of the following report: ${reports[0].report_code_label.trim()} ` +
    `${DateUtils.convertFecFormatToSlashFormat(reports[0].coverage_from_date)} - ` +
    `${DateUtils.convertFecFormatToSlashFormat(reports[0].coverage_through_date)}`
  );
}

export function createInitialModel(
  report: BaseForm3 | null | undefined,
  isF3X: boolean,
  defaultFilingFrequency: FilingFrequency,
  defaultState: string | null,
): SharedForm3Model {
  if (report) return editFormModel(report, isF3X, defaultState);
  return createFormModel(defaultFilingFrequency, defaultState);
}

function createFormModel(filingFrequency: FilingFrequency, state: string | null): SharedForm3Model {
  return {
    filingFrequency,
    reportTypeCategory: getDefaultTypeCategory(),
    reportCode: null,
    coverage: {
      startDate: null,
      endDate: null,
    },
    electionReport: {
      date: null,
      state,
    },
    electionCycle: null,
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
  };
}
