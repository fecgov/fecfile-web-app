import { F3xReportCode } from '../models/f3x-summary.model';
import { WebPrintSubmission } from '../models/webprint-submission.model';
import { UploadSubmission } from '../models/upload-submission.model';

export interface Report {
  id: number | undefined;
  form_type: string;
  filer_committee_id_number: string | null;
  report_code: F3xReportCode | null;
  coverage_from_date: Date | null;
  coverage_through_date: Date | null;
  webprint_submission: WebPrintSubmission | null;
  upload_submission: UploadSubmission | null;
  created: Date | null;
  updated: Date | null;
  calculation_status: string | undefined;
}

export interface CashOnHand {
  report_id: number | undefined;
  value: number | null;
}
