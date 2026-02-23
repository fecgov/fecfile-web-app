import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { IN_KIND_TRANSFER_FEA_OUT } from './IN_KIND_TRANSFER_FEA_OUT.model';

describe('IN_KIND_OUT', () => {
  let transactionType: IN_KIND_TRANSFER_FEA_OUT;

  beforeEach(() => {
    transactionType = new IN_KIND_TRANSFER_FEA_OUT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_TRANSFER_FEA_OUT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
