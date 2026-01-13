import { Exclude, plainToClass, Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { TransactionType } from './transaction-type.model';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

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
  report_ids: string[] | undefined;
  parent_transaction_id: string | undefined;
  @Type(() => TransactionType)
  @Exclude({ toPlainOnly: true })
  transactionType: TransactionType = {} as TransactionType;

  get formTypeLabel(): string {
    if (!this.form_type) return '';

    const labels: Record<string, string> = {
      F3: 'Form 3',
      F3X: 'Form 3X',
      F24: 'Form 24',
      F5: 'Form 5',
      F6: 'Form 6',
      F7: 'Form 7',
      F13: 'Form 13',
      F99: 'Form 99',
      F1M: 'Form 1M',
    };

    return labels[this.form_type] || this.form_type; // Fallback to code if not found
  }

  // prettier-ignore
  static fromJSON(json: any): TransactionListRecord { // eslint-disable-line @typescript-eslint/no-explicit-any
    const transactionListRecord =  plainToClass(TransactionListRecord, json);
    if (transactionListRecord.transaction_type_identifier) {
      transactionListRecord.transactionType = TransactionTypeUtils.factory(transactionListRecord.transaction_type_identifier);
    }
    return transactionListRecord;
  }
}
