import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { REFUND_PARTY_CONTRIBUTION } from './REFUND_PARTY_CONTRIBUTION.model';

describe('REFUND_PARTY_CONTRIBUTION', () => {
  let transactionType: REFUND_PARTY_CONTRIBUTION;

  beforeEach(() => {
    transactionType = new REFUND_PARTY_CONTRIBUTION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
