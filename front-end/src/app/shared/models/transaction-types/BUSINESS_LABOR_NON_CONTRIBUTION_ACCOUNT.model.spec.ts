import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';
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

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account');
  });
});
