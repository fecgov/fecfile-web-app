import { SchCTransaction } from '../transaction/schedule-c/schc-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleCTransactionTypes } from '../transaction/schedule-c/schedule-c-transaction-types.model';

describe('LOAN_RECEIVED_FROM_BANK', () => {
  let transaction: SchCTransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('C');
  });

  it('#factory() should return a SchCTransaction', () => {
    expect(transaction.form_type).toBe('SC/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);
  });
});
