import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL } from './NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL.model';

describe('NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-Contribution Account - Payroll: See Below');
  });
});
