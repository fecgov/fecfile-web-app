import type { DateOverlapResponse } from 'app/shared/components/signal-inputs/date-input/date.validators';
import { MaybeFieldTree } from '@angular/forms/signals';
import { DateUtils } from 'app/shared/utils/date.utils';

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
