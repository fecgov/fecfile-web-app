import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT } from './OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT.model';

describe('OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT', () => {
  let transactionType: OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    const txn = transactionType.getNewTransaction();
    expect(transactionType.generatePurposeDescription(txn)).toBe(
      'Credit card memo entries do not meet itemization threshold.',
    );
  });
});
