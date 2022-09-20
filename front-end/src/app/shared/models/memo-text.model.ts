import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export class MemoText extends BaseModel {
  id: string | undefined;
  rec_type: string | null = null;
  filer_committee_id_number: string | null = null;
  transaction_id_number: string | null = null;
  back_reference_tran_id_number: string | null = null;
  back_reference_sched_form_name: string | null = null;
  text4000: string | null = null;

  report_id: string | undefined; // Foreign key to the F3XSummary model

  // prettier-ignore
  static fromJSON(json: any): MemoText { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(MemoText, json);
  }
}
