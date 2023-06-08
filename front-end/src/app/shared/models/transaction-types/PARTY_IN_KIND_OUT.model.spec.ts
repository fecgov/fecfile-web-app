import { IN_KIND_OUT } from './IN_KIND_OUT.model';
import { TransactionGroupAA } from '../transaction-groups/transaction-group-aa.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';

describe('IN_KIND_OUT', () => {
  let transactionType: IN_KIND_OUT;

  beforeEach(() => {
    transactionType = new IN_KIND_OUT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupAA);
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SB21B');
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_OUT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
