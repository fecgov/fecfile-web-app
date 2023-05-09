import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT } from './OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT.model';

describe('OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT', () => {
  let transactionType: OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Headquarters Buildings Account: Refund');
  });
});
