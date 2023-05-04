import { INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT } from './INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a';

describe('INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT(new TransactionGroupA());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account');
  });
});
