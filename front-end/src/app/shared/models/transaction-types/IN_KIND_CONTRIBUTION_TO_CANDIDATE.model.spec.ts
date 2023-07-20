import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupN } from '../transaction-groups/transaction-group-n.model';

describe('IN_KIND_CONTRIBUTION_TO_CANDIDATE', () => {
  let transaction: SchBTransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE
    ) as SchBTransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('B');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupN);
  });

  it('#factory() should return a SchBTransaction', () => {
    expect(transaction.form_type).toBe('SB23');
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE);
  });
});
