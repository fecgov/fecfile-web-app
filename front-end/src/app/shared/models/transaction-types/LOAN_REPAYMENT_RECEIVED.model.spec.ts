import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
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

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA14');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED);
  });
  it('#generatePurposeDescription() should generate loan repayment', () => {
    expect(transactionType.generatePurposeDescription()).toEqual('Loan Repayment');
  });
});
