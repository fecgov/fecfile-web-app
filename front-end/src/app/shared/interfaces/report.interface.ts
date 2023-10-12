import { WebPrintSubmission } from '../models/webprint-submission.model';
import { UploadSubmission } from '../models/upload-submission.model';
import { F3xReportCodes } from '../utils/report-code.utils';

export interface Report {
  id: string | undefined;
  form_type: string;
  report_version: string | undefined;
  report_code: F3xReportCodes | undefined;
  coverage_from_date: Date | undefined;
  coverage_through_date: Date | undefined;
  webprint_submission: WebPrintSubmission | undefined;
  upload_submission: UploadSubmission | undefined;
  created: Date | undefined;
  updated: Date | undefined;
  calculation_status: string | undefined;
}

export interface CashOnHand {
  report_id: string | undefined;
  value: number | undefined;
}
