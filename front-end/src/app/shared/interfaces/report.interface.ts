import { F3xReportCode } from '../models/f3x-summary.model';
import { WebPrintSubmission } from '../models/webprint-submission.model';
import { UploadSubmission } from '../models/upload-submission.model';

export interface Report {
  id: number | undefined;
  form_type: string;
  filer_committee_id_number: string | undefined;
  report_code: F3xReportCode | undefined;
  coverage_from_date: Date | undefined;
  coverage_through_date: Date | undefined;
  webprint_submission: WebPrintSubmission | undefined;
  upload_submission: UploadSubmission | undefined;
  created: Date | undefined;
  updated: Date | undefined;
  calculation_status: string | undefined;
}

export interface CashOnHand {
  report_id: number | undefined;
  value: number | undefined;
}
