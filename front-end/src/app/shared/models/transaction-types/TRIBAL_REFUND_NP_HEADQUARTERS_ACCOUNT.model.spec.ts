import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';
import { TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT } from './TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT.model';

describe('TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT', () => {
  let transactionType: TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupD);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Headquarters Buildings Account: Refund');
  });
});
