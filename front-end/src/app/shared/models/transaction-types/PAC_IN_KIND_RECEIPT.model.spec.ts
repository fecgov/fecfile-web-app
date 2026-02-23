import { SchATransaction } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleATransactionTypes } from '../type-enums';

describe('PAC_IN_KIND_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(async () => {
    transaction = (await getTestTransactionByType(ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT)) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11C');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT);
  });
});
