import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JOINT_FUNDRAISING_TRANSFER } from './JOINT_FUNDRAISING_TRANSFER.model';
import { PARTY_JF_TRANSFER_MEMO } from './PARTY_JF_TRANSFER_MEMO.model';

describe('PARTY_JF_TRANSFER_MEMO', () => {
  let transactionType: PARTY_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PARTY_JF_TRANSFER_MEMO();
    transactionType.transaction = transactionType.getNewTransaction();
    transactionType.transaction.parent_transaction = new JOINT_FUNDRAISING_TRANSFER().getNewTransaction();
    (transactionType.transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
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

  it('#generatePurposeDescription() should return appropriate retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe(`JF Memo: Test Org`);
  });
});
