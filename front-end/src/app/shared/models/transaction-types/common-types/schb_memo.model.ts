import { SchBTransactionType } from '../../schb-transaction-type.model';

export abstract class SchBMemo extends SchBTransactionType {
  override mandatoryFormValues = {
    [this.templateMap.memo_code]: true,
  };
}
