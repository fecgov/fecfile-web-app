import { SchBTransactionType } from '../../schb-transaction-type.model';

export abstract class SCHEDULE_B_MEMO extends SchBTransactionType {
  override mandatoryFormValues = {
    [this.templateMap.memo_code]: true,
  };
}
