import { Exclude, plainToClass, Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { TransactionType } from './transaction-type.model';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

export class TransactionListRecord extends BaseModel {
  id: string | undefined;
  transaction_type_identifier: string | undefined;
  form_type: string | undefined;
  report_type: string | undefined;
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
  parent_transaction: TransactionListRecord | undefined;
  @Type(() => TransactionType)
  @Exclude({ toPlainOnly: true })
  transactionType: TransactionType = {} as TransactionType;
  can_delete?: boolean;
  loan_id?: string;
  debt_id?: string;
  loan_agreement_id?: string;
  force_itemized?: boolean;

  // prettier-ignore
  static fromJSON(json: any): TransactionListRecord { // eslint-disable-line @typescript-eslint/no-explicit-any
    const transactionListRecord =  plainToClass(TransactionListRecord, json);
    if (transactionListRecord.transaction_type_identifier) {
      transactionListRecord.transactionType = TransactionTypeUtils.factory(transactionListRecord.transaction_type_identifier);
    }
    return transactionListRecord;
  }
}
