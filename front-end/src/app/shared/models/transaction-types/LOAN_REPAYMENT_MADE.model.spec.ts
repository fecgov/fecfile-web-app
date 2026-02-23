import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { LOAN_REPAYMENT_MADE } from './LOAN_REPAYMENT_MADE.model';

describe('LOAN_REPAYMENT_MADE', () => {
  let transactionType: LOAN_REPAYMENT_MADE;

  beforeEach(() => {
    transactionType = new LOAN_REPAYMENT_MADE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB26');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE);
  });

  it('#generatePurposeDescription() should be defined', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Loan Repayment');
  });
});
