import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO } from './FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO.model';

describe('FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO,
    );
  });

  it('#generatePurposeDescription() should be undefined', () => {
    expect(transactionType.generatePurposeDescription).toBe(undefined);
  });
});
