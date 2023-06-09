import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupAA } from '../transaction-groups/transaction-group-aa.model';

describe('IN_KIND_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.IN_KIND_RECEIPT) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupAA);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11AI');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.IN_KIND_RECEIPT);
  });
});
