import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JF_TRAN_PAC_MEMO } from './JF_TRAN_PAC_MEMO.model';

describe('JF_TRAN_PAC_MEMO', () => {
  let transactionType: JF_TRAN_PAC_MEMO;

  beforeEach(() => {
    transactionType = new JF_TRAN_PAC_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.JF_TRAN_PAC_MEMO);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe(`JF Memo: ${transactionType.parent?.contributor_organization_name}`);
  });
});
