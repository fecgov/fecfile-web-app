import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION_VOID } from './REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION_VOID.model';

describe('REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION_VOID', () => {
  let transactionType: REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION_VOID;

  beforeEach(() => {
    transactionType = new REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.REFUND_RECEIPTS_FROM_UNREGISTERED_ORGANIZATION_VOID,
    );
  });
});
