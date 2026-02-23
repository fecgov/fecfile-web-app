import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT } from './NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT.model';

describe('NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account - Credit Card: See Below');
  });
});
