import { TransactionType } from 'app/shared/models/transaction-type.model';
import { FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT } from './FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';

describe('FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
