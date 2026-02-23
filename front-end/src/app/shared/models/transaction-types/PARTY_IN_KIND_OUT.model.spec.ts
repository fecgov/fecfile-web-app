import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { PARTY_IN_KIND_OUT } from './PARTY_IN_KIND_OUT.model';

describe('IN_KIND_OUT', () => {
  let transactionType: PARTY_IN_KIND_OUT;

  beforeEach(() => {
    transactionType = new PARTY_IN_KIND_OUT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.PARTY_IN_KIND_OUT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
