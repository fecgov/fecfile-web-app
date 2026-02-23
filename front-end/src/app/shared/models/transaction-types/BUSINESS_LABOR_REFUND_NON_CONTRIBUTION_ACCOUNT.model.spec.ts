import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT } from './BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT.model';
import { ScheduleBTransactionTypes } from '../type-enums';

describe('BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT', () => {
  let transactionType: BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  xit('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account Refund');
  });
});
