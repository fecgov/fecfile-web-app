import { Transform, Type } from 'class-transformer';
import { JsonSchema } from '../interfaces/json-schema.interface';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';
import { SchemaNames } from 'fecfile-validate/fecfile_validate_js/dist/schema-names-export';

export abstract class Report extends BaseModel {
  id: string | undefined;
  committee_name?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  abstract schema: JsonSchema;
  abstract schemaName: SchemaNames;
  abstract report_type: ReportTypes;
  abstract form_type: string;
  hasChangeOfAddress = false;
  submitAlertText =
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action. Any changes needed will need to be filed as an amended report.';
  report_version: string | undefined; // Tracks amendment versions
  report_id: string | undefined; // FEC assigned report ID
  confirmation_email_1: string | undefined;
  confirmation_email_2: string | undefined;
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
  can_delete = false;
  can_unamend = false;
  version_label?: string;
  report_code?: string;
  report_code_label?: string;

  abstract get formLabel(): string;

  abstract get formSubLabel(): string;

  get coverageDates(): { [date: string]: Date | undefined } | undefined {
    return;
  }

  get canAmend() {
    return false;
  }

  getLongLabel(): string {
    return this.form_type;
  }
}

export enum ReportTypes {
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
  F1M = 'F1M',
}

export const reportLabelList: LabelList = [
  [ReportTypes.F3X, 'Form 3X'],
  [ReportTypes.F24, 'Form 24'],
  [ReportTypes.F99, 'Form 99'],
  [ReportTypes.F1M, 'Form 1M'],
];

export enum ReportStatus {
  IN_PROGRESS = 'In progress',
  SUBMIT_SUCCESS = 'Submission success',
}
