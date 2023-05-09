import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';
import { OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO } from './OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO.model';

describe('OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO', () => {
  let transactionType: OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription).toBe(undefined);
  });
});
