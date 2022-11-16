import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { INDIVIDUAL_JF_TRANSFER_MEMO } from './INDIVIDUAL_JF_TRANSFER_MEMO.model';

describe('INDIVIDUAL_JF_TRANSFER_MEMO', () => {
  let transactionType: INDIVIDUAL_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO);
  });

  it('#contributionPurposeDescripReadonly() should return appropriate retval', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(
      `JF Memo: ${(transactionType.transaction?.parent_transaction as SchATransaction).contributor_organization_name}`
    );
  });
});
