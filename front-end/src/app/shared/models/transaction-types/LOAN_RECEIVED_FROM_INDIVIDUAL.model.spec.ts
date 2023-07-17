import { SchCTransaction, ScheduleCTransactionTypes } from '../schc-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupZB } from '../transaction-groups/transaction-group-zb.model';

describe('LOAN_RECEIVED_FROM_INDIVIDUAL', () => {
  let transaction: SchCTransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('C');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupZB);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SC/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);
  });
});
