import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';
import { OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT } from './OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT.model';

describe('OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT', () => {
  let transactionType: OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    const txn = transactionType.getNewTransaction();
    expect(transactionType.generatePurposeDescription(txn)).toBe(
      'Credit card memo entries do not meet itemization threshold.',
    );
    txn.children = [
      {
        itemized: true,
      } as SchBTransaction,
    ];
    expect(transactionType.generatePurposeDescription(txn)).toBe('Credit Card Memo: See Below');
  });
});
