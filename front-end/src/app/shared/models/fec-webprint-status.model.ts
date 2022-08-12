import { plainToClass, Transform, TransformationType, TransformFnParams, Type } from "class-transformer";
import { BaseModel } from "./base.model";


export class FECWebPrintStatus {
  fec_email = "";
  fec_batch_id = "";
  fec_image_url = "";
  fec_submission_id = "";
  fec_message = "";
  fec_status: "COMPLETED" | "FAILED" | "PROCESSING" | null = null;
  fecfile_error = "";
  fecfile_task_state = "";
  id = 0;
  @Type(()=> Date)
  @Transform(BaseModel.dateTransform) created: Date | null = null;
  @Type(()=> Date)
  @Transform(BaseModel.dateTransform) updated: Date | null = null;

  // prettier-ignore
  static fromJSON(json: any): FECWebPrintStatus { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(FECWebPrintStatus, json);
  }

  toString(): string {
    return "[object FECUploadStatus]";
  }

  /**
   *
   * @param {TransformFnParams} params
   * @returns {FECUploadStatus | string | null} 
   */
  static transform(params: TransformFnParams): FECWebPrintStatus | string | null {
    if (
      params.type === TransformationType.PLAIN_TO_CLASS && 
      params.value && 
      typeof params.value === 'string'
    ) {
      return FECWebPrintStatus.fromJSON(params.value);
    }
    return params.value;
  }
}