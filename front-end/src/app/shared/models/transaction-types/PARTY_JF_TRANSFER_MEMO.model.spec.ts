import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTY_JF_TRANSFER_MEMO } from './PARTY_JF_TRANSFER_MEMO.model';

describe('PARTY_JF_TRANSFER_MEMO', () => {
  let transactionType: PARTY_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PARTY_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO);
  });

  it('#contributionPurposeDescripReadonly() should return appropriate retval', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(`JF Memo: ${transactionType.transaction.parent_transaction?.contributor_organization_name}`);
  });
});
