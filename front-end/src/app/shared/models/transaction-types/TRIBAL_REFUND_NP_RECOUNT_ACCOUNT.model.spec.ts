import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TRIBAL_REFUND_NP_RECOUNT_ACCOUNT } from './TRIBAL_REFUND_NP_RECOUNT_ACCOUNT.model';

describe('TRIBAL_REFUND_NP_RECOUNT_ACCOUNT', () => {
  let transactionType: TRIBAL_REFUND_NP_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new TRIBAL_REFUND_NP_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount/Legal Proceedings Account: Refund');
  });
});
