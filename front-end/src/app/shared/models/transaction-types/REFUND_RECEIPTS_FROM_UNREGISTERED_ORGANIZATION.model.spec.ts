import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION } from './REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION.model';

describe('REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION', () => {
  let transactionType: REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION;

  beforeEach(() => {
    transactionType = new REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION,
    );
  });
});
