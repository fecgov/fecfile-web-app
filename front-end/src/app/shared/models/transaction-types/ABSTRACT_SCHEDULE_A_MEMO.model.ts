import { SchATransactionType } from '../scha-transaction-type.model';

export abstract class ABSTRACT_SCHEDULE_A_MEMO extends SchATransactionType {
  override mandatoryFormValues = {
    [this.templateMap.memo_code]: true,
  };
}
