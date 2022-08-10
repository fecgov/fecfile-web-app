import { plainToClass, Transform, TransformationType, TransformFnParams } from "class-transformer";
import { BaseModel } from "./base.model";


export class FECUploadStatus {
  fec_report_id = "";
  message = "";
  status: "ACCEPTED" | "REJECTED" | "PROCESSING" | "" = "";
  submission_id = "";
  success: boolean | null = null;
  @Transform(BaseModel.dateTransform) acceptance_datetime: Date | null = null;

  public test_method(): void {
    console.log("TEST");
  }

  // prettier-ignore
  static fromJSON(json: any): FECUploadStatus { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (json === undefined || json === null)
      return FECUploadStatus.fromJSON({});
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