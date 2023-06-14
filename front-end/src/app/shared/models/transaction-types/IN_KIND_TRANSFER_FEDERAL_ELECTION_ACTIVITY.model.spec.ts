import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupEE } from '../transaction-groups/transaction-group-ee.model';

describe('IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY
    ) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupEE);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA12');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY
    );
  });
});
