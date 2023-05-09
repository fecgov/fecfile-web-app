import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';
import { OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT } from './OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT.model';

describe('OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT', () => {
  let transactionType: OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupD);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Credit Card: See Below');
  });
});
