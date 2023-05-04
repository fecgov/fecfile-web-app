import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b';
import { REFUND_INDIVIDUAL_CONTRIBUTION } from './REFUND_INDIVIDUAL_CONTRIBUTION.model';

describe('REFUND_INDIVIDUAL_CONTRIBUTION', () => {
  let transactionType: REFUND_INDIVIDUAL_CONTRIBUTION;

  beforeEach(() => {
    transactionType = new REFUND_INDIVIDUAL_CONTRIBUTION(new TransactionGroupB());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28A');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION);
  });
});
