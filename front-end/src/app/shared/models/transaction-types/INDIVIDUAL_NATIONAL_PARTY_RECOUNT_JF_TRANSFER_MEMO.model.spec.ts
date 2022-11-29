import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO } from './INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model';

describe('INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO', () => {
  let transactionType: INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO();
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
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO
    );
  });

  it('#generateContributionPurposeDescription() should generate a string', () => {
    const descrip = transactionType.generateContributionPurposeDescription();
    expect(descrip).toBe(
      `Recount/Legal Proceedings Account JF Memo: ${
        (transactionType.transaction?.parent_transaction as SchATransaction)?.contributor_organization_name
      }`
    );
  });
});
