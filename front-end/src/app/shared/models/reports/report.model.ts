import { Exclude, Transform, Type } from 'class-transformer';
import { BaseModel } from '../base.model';
import { UploadSubmission } from '../upload-submission.model';
import { WebPrintSubmission } from '../webprint-submission.model';
import type { ReportSidebarSection } from 'app/layout/sidebar/report-sidebar-section.model';
import type { ReportTypes } from './report-types.model';
import type { JsonSchema } from 'fecfile-validate';
import type { MenuItem } from 'primeng/api';
import type { TransactionTypes } from '../transaction/transaction-types';
import { ReportStatus } from './report-status.model';

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
  fec_report_id: string | undefined; // FEC assigned report ID
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

  get canAmend() {
    return false;
  }

  @Exclude()
  transactionTypes: TransactionTypes[] = [];

  get canEdit(): boolean {
    return this.report_status === ReportStatus.IN_PROGRESS || this.report_status === ReportStatus.SUBMIT_FAILURE;
  }
}
