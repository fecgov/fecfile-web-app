import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT } from './FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT.model';

describe('FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
