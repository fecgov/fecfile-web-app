import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d';
import { REFUND_UNREGISTERED_CONTRIBUTION_VOID } from './REFUND_UNREGISTERED_CONTRIBUTION_VOID.model';

describe('REFUND_UNREGISTERED_CONTRIBUTION_VOID', () => {
  let transactionType: REFUND_UNREGISTERED_CONTRIBUTION_VOID;

  beforeEach(() => {
    transactionType = new REFUND_UNREGISTERED_CONTRIBUTION_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupD);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID);
  });
});
