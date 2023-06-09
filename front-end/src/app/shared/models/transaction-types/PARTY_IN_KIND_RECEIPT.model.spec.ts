import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupEE } from '../transaction-groups/transaction-group-ee.model';

describe('PARTY_IN_KIND_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupEE);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11B');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT);
  });
});
