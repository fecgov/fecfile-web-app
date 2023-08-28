import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('LOAN_REPAYMENT_RECEIVED', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA14');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED);
  });
  it('#generatePurposeDescription() should generate loan repayment', () => {
    expect(transaction.transactionType?.generatePurposeDescription).toEqual('Loan Repayment');
  });
});
