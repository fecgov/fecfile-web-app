import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT } from './INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT.model';

describe('INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT);
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Headquarters Buildings Account: Refund');
  });
});
