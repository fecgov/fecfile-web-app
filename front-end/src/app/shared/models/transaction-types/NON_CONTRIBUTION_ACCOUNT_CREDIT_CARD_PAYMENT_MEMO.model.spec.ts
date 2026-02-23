import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO } from './NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO.model';

describe('NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO,
    );
  });

  it('#generatePurposeDescription() should be undefined', () => {
    expect(transactionType.generatePurposeDescription).toBe(undefined);
  });
});
