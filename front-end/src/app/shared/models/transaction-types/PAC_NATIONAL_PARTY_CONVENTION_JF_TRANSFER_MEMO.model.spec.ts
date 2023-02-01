import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO } from './PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model';

describe('PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO', () => {
  let transactionType: PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    );
  });

  it('#purposeDescriptionGenerator() should generate a string', () => {
    const descrip = transactionType.purposeDescriptionGenerator();
    expect(descrip).toBe(
      `Pres. Nominating Convention Account JF Memo: ${
        (transactionType.transaction?.parent_transaction as SchATransaction)?.contributor_organization_name
      }`
    );
  });
});
