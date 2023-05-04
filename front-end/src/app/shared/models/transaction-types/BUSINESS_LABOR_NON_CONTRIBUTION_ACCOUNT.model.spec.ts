import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d';
import { BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT } from './BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT.model';

describe('TRIBAL_RECEIPT', () => {
  let transactionType: BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT(new TransactionGroupD());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupD);
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
