import { plainToClass, Transform, TransformationType, TransformFnParams, Type } from "class-transformer";
import { BaseModel } from "./base.model";


export class FECUploadStatus {
  fecfile_task_state = "";
  fecfile_error = "";
  fec_submission_id = "";
  fec_report_id = "";
  fec_message = "";
  fec_status: "ACCEPTED" | "REJECTED" | "PROCESSING" | null = null;
  @Type(()=> Date)
  @Transform(BaseModel.dateTransform) created: Date | null = null;
  @Type(()=> Date)
  @Transform(BaseModel.dateTransform) updated: Date | null = null;

  // prettier-ignore
  static fromJSON(json: any): FECUploadStatus { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(FECUploadStatus, json);
  }

  /**
   *
   * @param {TransformFnParams} params
   * @returns {FECUploadStatus | string | null} 
   */
  static transform(params: TransformFnParams): FECUploadStatus | string | null {
    if (
      params.type === TransformationType.PLAIN_TO_CLASS && 
      params.value && 
      typeof params.value === 'string'
    ) {
      return FECUploadStatus.fromJSON(params.value);
    }
    if (
      params.type === TransformationType.CLASS_TO_PLAIN &&
      params.value &&
      Object.prototype.toString.call(params.value) === '[object FECUploadStatus]'
    ) {
      return JSON.stringify(params.value);
    }
    return params.value;
  }
}