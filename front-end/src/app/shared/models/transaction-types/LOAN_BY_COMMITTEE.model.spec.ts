import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchCTransaction } from '../schc-transaction.model';
import { ScheduleCTransactionTypes } from '../type-enums';

describe('LOAN_BY_COMMITTEE', () => {
  let transaction: SchCTransaction;

  beforeEach(async () => {
    transaction = (await getTestTransactionByType(ScheduleCTransactionTypes.LOAN_BY_COMMITTEE)) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('C');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SC/9');
    expect(transaction.transaction_type_identifier).toBe(ScheduleCTransactionTypes.LOAN_BY_COMMITTEE);
  });
});
