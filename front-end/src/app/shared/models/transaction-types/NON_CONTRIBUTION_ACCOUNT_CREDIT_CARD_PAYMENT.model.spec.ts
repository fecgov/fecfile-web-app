import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT } from './NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT.model';

describe('NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('D');
  });

  xit('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-Contribution Account - Credit Card: See Below');
  });
});
