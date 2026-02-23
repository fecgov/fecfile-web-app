import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO } from './OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO.model';

describe('OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO', () => {
  let transactionType: OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription).toBe(undefined);
  });
});
