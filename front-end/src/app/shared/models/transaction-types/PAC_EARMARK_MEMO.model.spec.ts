import { PAC_EARMARK_MEMO } from './PAC_EARMARK_MEMO.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('PAC_EARMARK_MEMO', () => {
  let transactionType: PAC_EARMARK_MEMO;

  beforeEach(() => {
    transactionType = new PAC_EARMARK_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA11C');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_EARMARK_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });
});
