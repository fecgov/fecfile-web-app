import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO } from './TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model';

describe('TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO', () => {
  let transactionType: TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO();
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
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    );
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(
      `Pres. Nominating Convention Account JF Memo: ${
        (transactionType.transaction?.parent_transaction as SchATransaction)?.contributor_organization_name
      }`
    );
  });
});
