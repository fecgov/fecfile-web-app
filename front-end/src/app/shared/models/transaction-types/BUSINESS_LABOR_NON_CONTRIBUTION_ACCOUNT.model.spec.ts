import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT } from './BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT.model';

describe('TRIBAL_RECEIPT', () => {
  let transactionType: BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT);
  });

  it('#purposeDescriptionGenerator() should generate a string', () => {
    const descrip = transactionType.purposeDescriptionGenerator();
    expect(descrip).toBe('Non-contribution Account Receipt');
  });
});
