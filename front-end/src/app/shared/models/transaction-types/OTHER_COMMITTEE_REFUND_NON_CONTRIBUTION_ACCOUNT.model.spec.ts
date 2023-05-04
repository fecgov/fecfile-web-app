import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';
import { OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT } from './OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT.model';

describe('OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT', () => {
  let transactionType: OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT(new TransactionGroupE());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  xit('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account Refund');
  });
});
