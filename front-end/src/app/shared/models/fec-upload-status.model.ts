import { plainToClass, Transform } from "class-transformer";
import { BaseModel } from "./base.model";


export class FECUploadStatus {
  fec_report_id: string = "";
  message: string = "";
  status: "ACCEPTED" | "REJECTED" | "PROCESSING" | "" = "";
  submission_id: string = "";
  success: boolean | null = null;
  @Transform(BaseModel.dateTransform) acceptance_datetime: Date | null = null;

  // prettier-ignore
  static fromJSON(json: any): FECUploadStatus { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (json === undefined || json === null)
      return FECUploadStatus.fromJSON({});
    return plainToClass(FECUploadStatus, json);
  }
}