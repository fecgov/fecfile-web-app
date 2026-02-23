import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT } from './BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT.model';

describe('TRIBAL_RECEIPT', () => {
  let transactionType: BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account');
  });
});
