import { Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { F3xReportCodes } from '../utils/report-code.utils';

export abstract class Report extends BaseModel {
  id: string | undefined;
  abstract schema: JsonSchema;
  abstract report_type: ReportTypes;
  abstract form_type: string;
  hasChangeOfAddress = false;
  submitAlertText =
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action. Any changes needed will need to be filed as an amended report.';
  report_version: string | undefined; // Tracks amendment versions
  report_id: string | undefined; // FEC assigned report ID
  confirmation_email_1: string | undefined;
  confirmation_email_2: string | undefined;
  is_first: boolean | undefined;
  @Type(() => UploadSubmission)
  @Transform(UploadSubmission.transform)
  upload_submission: UploadSubmission | undefined;
  report_status: string | undefined;
  @Type(() => WebPrintSubmission)
  @Transform(WebPrintSubmission.transform)
  webprint_submission: WebPrintSubmission | undefined;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  created: Date | undefined;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  updated: Date | undefined;
  deleted: string | undefined;

  abstract get formLabel(): string;

  abstract get formSubLabel(): string;

  abstract get versionLabel(): string;

  get reportCode(): F3xReportCodes | undefined {
    return;
  }

  get coverageDates(): { [date: string]: Date | undefined } | undefined {
    return;
  }

  get canAmend() {
    return false;
  }

  getBlocker(): string | undefined {
    return;
  }
}

export enum ReportTypes {
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
  F1M = 'F1M',
}

export enum ReportStatus {
  IN_PROGRESS = 'In progress',
  SUBMIT_SUCCESS = 'Submission success',
}
