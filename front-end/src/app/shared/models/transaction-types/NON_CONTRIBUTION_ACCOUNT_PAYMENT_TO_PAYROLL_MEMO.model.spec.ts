import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupC } from '../transaction-groups/transaction-group-c';
import { NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO } from './NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO.model';

describe('NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupC);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO
    );
  });

  it('#generatePurposeDescription() should be undefined', () => {
    expect(transactionType.generatePurposeDescription).toBe(undefined);
  });
});
