import { plainToClass, Transform, TransformationType, TransformFnParams, Type } from 'class-transformer';
import { BaseModel } from './base.model';

export class UploadSubmission {
  fecfile_task_state = '';
  fecfile_error = '';
  fec_submission_id = '';
  fec_report_id = '';
  fec_message = '';
  fec_status: 'ACCEPTED' | 'REJECTED' | 'PROCESSING' | null = null;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  created: Date | null = null;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  updated: Date | null = null;

  // prettier-ignore
  static fromJSON(json: any): UploadSubmission { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(UploadSubmission, json);
  }

  toString(): string {
    return '[object UploadSubmission]';
  }

  /**
   *
   * @param {TransformFnParams} params
   * @returns {UploadSubmission | string | null}
   */
  static transform(params: TransformFnParams): UploadSubmission | string | null {
    if (params.type === TransformationType.PLAIN_TO_CLASS && params.value && typeof params.value === 'string') {
      return UploadSubmission.fromJSON(params.value);
    }
    return params.value;
  }
}
