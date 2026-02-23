import { EARMARK_MEMO_HEADQUARTERS_ACCOUNT } from './EARMARK_MEMO_HEADQUARTERS_ACCOUNT.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('EARMARK_MEMO_HEADQUARTERS_ACCOUNT', () => {
  let transactionType: EARMARK_MEMO_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new EARMARK_MEMO_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO_HEADQUARTERS_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });
});
