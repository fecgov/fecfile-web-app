import { EARMARK_MEMO } from './EARMARK_MEMO.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('EARMARK_MEMO', () => {
  let transactionType: EARMARK_MEMO;

  beforeEach(() => {
    transactionType = new EARMARK_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });
});
