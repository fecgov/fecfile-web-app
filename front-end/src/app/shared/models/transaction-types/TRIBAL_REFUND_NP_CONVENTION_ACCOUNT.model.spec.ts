import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TRIBAL_REFUND_NP_CONVENTION_ACCOUNT } from './TRIBAL_REFUND_NP_CONVENTION_ACCOUNT.model';

describe('TRIBAL_REFUND_NP_CONVENTION_ACCOUNT', () => {
  let transactionType: TRIBAL_REFUND_NP_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new TRIBAL_REFUND_NP_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account: Refund');
  });
});
