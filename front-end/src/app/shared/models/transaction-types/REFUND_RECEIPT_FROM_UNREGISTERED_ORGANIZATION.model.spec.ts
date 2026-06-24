import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION } from './REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION.model';

describe('REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION', () => {
  let transactionType: REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION;

  beforeEach(() => {
    transactionType = new REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
    );
  });
});
