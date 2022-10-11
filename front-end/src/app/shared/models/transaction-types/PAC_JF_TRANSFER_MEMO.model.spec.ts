import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PAC_JF_TRANSFER_MEMO } from './PAC_JF_TRANSFER_MEMO.model';

describe('PAC_JF_TRANSFER_MEMO', () => {
  let transactionType: PAC_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PAC_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(`Joint Fundraising Memo: ${transactionType.parent?.contributor_organization_name}`);
  });
});
