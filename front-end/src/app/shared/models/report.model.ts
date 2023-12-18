import { Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';
import { Form3X } from './form-3x.model';
import { Form99 } from './form-99.model';
import { Form1M } from './form-1m.model';
import { Form24 } from './form-24.model';

export abstract class Report extends BaseModel {
  id: string | undefined;
  abstract report_type: ReportTypes;
  abstract form_type: string;
  abstract get formLabel(): string;
  abstract get versionLabel(): string;
  get transactionTableTitle(): string {
    return this.formLabel;
  }
  report_version: string | undefined; // Tracks amendment versions
  report_id: string | undefined; // FEC assigned report ID
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
}

export enum ReportTypes {
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
  F1M = 'F1M',
}
