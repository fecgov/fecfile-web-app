import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_JF_TRANSFER_MEMO } from './PARTNERSHIP_JF_TRANSFER_MEMO.model';

describe('PARTNERSHIP_JF_TRANSFER_MEMO', () => {
  let transactionType: PARTNERSHIP_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  xit('#factory() should return a SchBTransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account Refund');
  });
});
