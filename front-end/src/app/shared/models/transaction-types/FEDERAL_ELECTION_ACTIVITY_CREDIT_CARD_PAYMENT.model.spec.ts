import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupM } from '../transaction-groups/transaction-group-m';
import { FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT } from './FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT.model';

describe('FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupM);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT);
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Credit Card: See Below');
  });
});
