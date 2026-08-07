import { LOAN_REPAYMENT_MADE } from './LOAN_REPAYMENT_MADE.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('LOAN_REPAYMENT_MADE', () => {
  let transactionType: LOAN_REPAYMENT_MADE;

  beforeEach(() => {
    transactionType = new LOAN_REPAYMENT_MADE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB26');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE);
  });

  it('#generatePurposeDescription() should be defined', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Loan Repayment');
  });
});
