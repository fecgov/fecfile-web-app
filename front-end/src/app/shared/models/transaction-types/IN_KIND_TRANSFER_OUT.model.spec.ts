import { ScheduleBTransactionTypes } from '../type-enums';
import { IN_KIND_TRANSFER_OUT } from './IN_KIND_TRANSFER_OUT.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('IN_KIND_OUT', () => {
  let transactionType: IN_KIND_TRANSFER_OUT;

  beforeEach(() => {
    transactionType = new IN_KIND_TRANSFER_OUT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
