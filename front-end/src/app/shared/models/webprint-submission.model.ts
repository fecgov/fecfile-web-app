import { plainToClass, Transform, TransformationType, TransformFnParams, Type } from 'class-transformer';
import { BaseModel } from './base.model';

export class WebPrintSubmission {
  fec_email = '';
  fec_batch_id = '';
  fec_image_url = '';
  fec_submission_id = '';
  fec_message = '';
  fec_status: 'COMPLETED' | 'FAILED' | 'PROCESSING' | undefined;
  fecfile_error = '';
  fecfile_task_state = '';
  id = 0;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  created: Date | undefined;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform)
  updated: Date | undefined;

  // prettier-ignore
  static fromJSON(json: any): WebPrintSubmission { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(WebPrintSubmission, json);
  }

  /**
   *
   * @param {TransformFnParams} params
   * @returns {UploadSubmission | string | null}
   */
  static transform(params: TransformFnParams): WebPrintSubmission | string | null {
    if (params.type === TransformationType.PLAIN_TO_CLASS && params.value && typeof params.value === 'string') {
      return WebPrintSubmission.fromJSON(params.value);
    }
    return params.value;
  }
}
