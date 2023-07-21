import { PAC_EARMARK_MEMO } from './PAC_EARMARK_MEMO.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PAC_EARMARK_MEMO', () => {
  let transactionType: PAC_EARMARK_MEMO;

  beforeEach(() => {
    transactionType = new PAC_EARMARK_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11C');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_EARMARK_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });
});
