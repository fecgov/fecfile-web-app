import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JOINT_FUNDRAISING_TRANSFER_PAC_MEMO } from './JOINT_FUNDRAISING_TRANSFER_PAC_MEMO.model';

describe('JOINT_FUNDRAISING_TRANSFER_PAC_MEMO', () => {
  let transactionType: JOINT_FUNDRAISING_TRANSFER_PAC_MEMO;

  beforeEach(() => {
    transactionType = new JOINT_FUNDRAISING_TRANSFER_PAC_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER_PAC_MEMO);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(`Joint Fundraising Memo: ${transactionType.parent?.contributor_organization_name}`);
  });
});
