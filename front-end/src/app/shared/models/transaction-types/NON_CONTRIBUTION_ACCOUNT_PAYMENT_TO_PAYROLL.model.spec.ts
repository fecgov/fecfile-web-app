import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';
import { NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL } from './NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL.model';

describe('NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const txn = transactionType.getNewTransaction();
    const descrip = transactionType.generatePurposeDescription(txn);
    expect(descrip).toBe('Payroll memo entries do not meet itemization threshold.');
    txn.children = [
      {
        itemized: true,
      } as SchBTransaction,
    ];
    expect(transactionType.generatePurposeDescription(txn)).toBe('Payroll Memo: See Below');
  });
});
