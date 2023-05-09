import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';
import { OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO } from './OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO.model';

describe('OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO', () => {
  let transactionType: OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription).toBe(undefined);
  });
});
