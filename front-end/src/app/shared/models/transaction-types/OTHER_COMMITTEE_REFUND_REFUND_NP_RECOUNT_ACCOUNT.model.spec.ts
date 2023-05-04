import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';
import { OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT } from './OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT.model';

describe('OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT', () => {
  let transactionType: OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT(new TransactionGroupE());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Recount/Legal Proceedings Account: Refund');
  });
});
