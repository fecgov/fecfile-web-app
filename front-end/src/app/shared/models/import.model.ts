import { plainToClass, Transform } from 'class-transformer';
import { BaseModel } from './base.model';

export class Import extends BaseModel {
  id: string | undefined;
  report_type: string | undefined;
  status: string | undefined;
  preprocessed_json: object | undefined;
  report: string | null = null;
  created: string | undefined;
  updated: string | undefined;
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;

  // prettier-ignore
  static fromJSON(json: any): Import { // eslint-disable-line @typescript-eslint/no-explicit-any
    const import_obj = plainToClass(Import, json);
    const json_str = import_obj.preprocessed_json;
    if (json_str){
      import_obj.preprocessed_json = JSON.parse(json_str as unknown as string);
    }
    return import_obj;
  }
}
