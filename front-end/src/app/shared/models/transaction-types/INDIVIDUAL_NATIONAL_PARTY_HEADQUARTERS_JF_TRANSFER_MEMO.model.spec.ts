import { INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO } from './INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JOINT_FUNDRAISING_TRANSFER } from './JOINT_FUNDRAISING_TRANSFER.model';

describe('INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO', () => {
  let transactionType: INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO();
    transactionType.transaction = transactionType.getNewTransaction();
    transactionType.transaction.parent_transaction = new JOINT_FUNDRAISING_TRANSFER().getNewTransaction();
    (transactionType.transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
    );
  });

  it('#purposeDescriptionGenerator() should generate a string', () => {
    const descrip = transactionType.purposeDescriptionGenerator();
    expect(descrip).toBe(`Headquarters Buildings Account JF Memo: Test Org`);
  });
});
