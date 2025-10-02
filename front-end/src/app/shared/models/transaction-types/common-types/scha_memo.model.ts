import { SchATransactionType } from '../../scha-transaction-type.model';

export abstract class SchAMemo extends SchATransactionType {
  override mandatoryFormValues = {
    [this.templateMap.memo_code]: true,
  };
}
