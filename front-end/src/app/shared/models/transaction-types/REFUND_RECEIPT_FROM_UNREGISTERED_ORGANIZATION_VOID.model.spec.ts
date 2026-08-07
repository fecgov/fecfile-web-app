import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';
import { REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID } from './REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID.model';

describe('REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID', () => {
  let transactionType: REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID;

  beforeEach(() => {
    transactionType = new REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID,
    );
  });
});
