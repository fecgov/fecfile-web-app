import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export class MemoText extends BaseModel {
  id: string | undefined;
  rec_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id_number: string | undefined;
  back_reference_tran_id_number: string | undefined;
  back_reference_sched_form_name: string | undefined;
  text4000: string | undefined;

  report_id: string | undefined; // Foreign key to the F3XSummary model

  // prettier-ignore
  static fromJSON(json: any): MemoText { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(MemoText, json);
  }
}
