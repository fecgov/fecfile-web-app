import { EARMARK_MEMO_HEADQUARTERS_ACCOUNT } from './EARMARK_MEMO_HEADQUARTERS_ACCOUNT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('EARMARK_MEMO_HEADQUARTERS_ACCOUNT', () => {
  let transactionType: EARMARK_MEMO_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new EARMARK_MEMO_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('GG');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO_HEADQUARTERS_ACCOUNT);
  });

  it('#purposeDescriptionGenerator() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });
});
