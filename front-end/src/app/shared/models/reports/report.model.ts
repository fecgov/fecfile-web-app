import { Exclude, Transform, Type } from 'class-transformer';
import { JsonSchema } from 'fecfile-validate';
import { ReportSidebarSection } from 'app/layout/sidebar/menu-info';
import { MenuItem } from 'primeng/api';
import { LabelList } from '../../utils/label.utils';
import { BaseModel } from '../base.model';
import { UploadSubmission } from '../upload-submission.model';
import { WebPrintSubmission } from '../webprint-submission.model';
import { TransactionTypes } from '../transaction.model';

export abstract class Report extends BaseModel {
  id: string | undefined;
  committee_name?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  zip?: string;
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
  @Type(() => UploadSubmission)
  @Transform(UploadSubmission.transform)
  upload_submission: UploadSubmission | undefined;

  report_status: ReportStatus | undefined;
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

  abstract getMenuItems(sidebarSection: ReportSidebarSection, isEditable: boolean): MenuItem[];
  abstract get formLabel(): string;

  abstract get formSubLabel(): string;

  get canAmend() {
    return false;
  }

  @Exclude()
  transactionTypes: TransactionTypes[] = [];
}

export enum ReportTypes {
  F3 = 'F3',
  F3X = 'F3X',
  F24 = 'F24',
  F99 = 'F99',
  F1M = 'F1M',
}

export const reportLabelList: LabelList = [
  [ReportTypes.F3, 'Form 3'],
  [ReportTypes.F3X, 'Form 3X'],
  [ReportTypes.F24, 'Form 24'],
  [ReportTypes.F99, 'Form 99'],
  [ReportTypes.F1M, 'Form 1M'],
];

export enum ReportStatus {
  IN_PROGRESS = 'In progress',
  SUBMIT_PENDING = 'Submission pending',
  SUBMIT_SUCCESS = 'Submission success',
  SUBMIT_FAILURE = 'Submission failure',
}
