import { plainToClass, Transform } from 'class-transformer';
import { BaseModel } from './base.model';

export class TransactionListRecord {
  id: string | undefined;
  transaction_type_identifier: string | undefined;
  back_reference_tran_id_number: string | undefined;
  form_type: string | undefined;
  transaction_id: string | undefined;
  line_label: string | undefined;
  itemized: boolean | undefined;
  force_unaggregated: boolean | undefined;
  name: string | undefined;
  @Transform(BaseModel.dateTransform) date: Date | undefined;
  memo_code: boolean | undefined;
  amount: number | undefined;
  balance: number | undefined;
  aggregate: number | undefined;
  report_code_label: string | undefined;

  // prettier-ignore
  static fromJSON(json: any): TransactionListRecord { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(TransactionListRecord, json);
  }
}
