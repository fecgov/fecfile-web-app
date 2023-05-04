import { PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO } from './PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a';

describe('PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO', () => {
  let transactionType: PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account Partnership Attribution');
  });
});
