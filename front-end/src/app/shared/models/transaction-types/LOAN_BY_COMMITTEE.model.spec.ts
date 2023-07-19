import { SchCTransaction, ScheduleCTransactionTypes } from '../schc-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupYB } from '../transaction-groups/transaction-group-yb.model';

describe('LOAN_BY_COMMITTEE', () => {
  let transaction: SchCTransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_BY_COMMITTEE) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('C');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupYB);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SC/9');
    expect(transaction.transaction_type_identifier).toBe(ScheduleCTransactionTypes.LOAN_BY_COMMITTEE);
  });
});
