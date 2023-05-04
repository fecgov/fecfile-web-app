import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupAG } from '../transaction-groups/transaction-group-ag';
import { EARMARK_MEMO_CONVENTION_ACCOUNT } from './EARMARK_MEMO_CONVENTION_ACCOUNT.model';

describe('EARMARK_MEMO_CONVENTION_ACCOUNT', () => {
  let transactionType: EARMARK_MEMO_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new EARMARK_MEMO_CONVENTION_ACCOUNT(new TransactionGroupAG);
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupAG);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Total earmarked through conduit.');
  });
});
