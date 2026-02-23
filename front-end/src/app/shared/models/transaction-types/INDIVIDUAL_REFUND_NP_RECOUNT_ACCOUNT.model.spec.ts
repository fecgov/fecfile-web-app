import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT } from './INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT.model';

describe('INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Recount/Legal Proceedings Account: Refund');
  });
});
