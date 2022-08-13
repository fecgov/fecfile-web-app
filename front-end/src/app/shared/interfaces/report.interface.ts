import { F3xReportCode } from '../models/f3x-summary.model';
import { WebPrintSubmission } from '../models/webprint-submission.model';

export interface Report {
  id: number | null;
  form_type: string;
  filer_committee_id_number: string | null;
  report_code: F3xReportCode | null;
  coverage_from_date: Date | null;
  coverage_through_date: Date | null;
  webprint_submission: WebPrintSubmission | null;
}

export interface CashOnHand {
  report_id: number | null;
  value: number | null;
}
