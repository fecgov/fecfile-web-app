import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';
import { LOAN_REPAYMENT_RECEIVED } from './LOAN_REPAYMENT_RECEIVED.model';

describe('LOAN_REPAYMENT_RECEIVED', () => {
  let transactionType: LOAN_REPAYMENT_RECEIVED;

  beforeEach(() => {
    transactionType = new LOAN_REPAYMENT_RECEIVED();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchATransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SA14');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED);
  });
  it('#generatePurposeDescription() should generate loan repayment', () => {
    expect(transactionType.generatePurposeDescription()).toEqual('Loan Repayment');
  });
});
