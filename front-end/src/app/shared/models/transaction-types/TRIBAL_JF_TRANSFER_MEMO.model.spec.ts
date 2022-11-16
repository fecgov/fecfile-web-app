import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JOINT_FUNDRAISING_TRANSFER } from './JOINT_FUNDRAISING_TRANSFER.model';
import { TRIBAL_JF_TRANSFER_MEMO } from './TRIBAL_JF_TRANSFER_MEMO.model';

describe('TRIBAL_JF_TRANSFER_MEMO', () => {
  let transactionType: TRIBAL_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new TRIBAL_JF_TRANSFER_MEMO();
    transactionType.transaction = transactionType.getNewTransaction();
    transactionType.transaction.parent_transaction = new JOINT_FUNDRAISING_TRANSFER().getNewTransaction();
    (transactionType.transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_JF_TRANSFER_MEMO);
  });

  it('#contributionPurposeDescripReadonly() should return appropriate retval', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(`JF Memo: Test Org`);
  });
});
