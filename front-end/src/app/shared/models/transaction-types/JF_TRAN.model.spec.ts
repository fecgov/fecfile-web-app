import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JF_TRAN } from './JF_TRAN.model';

describe('JF_TRAN', () => {
  let transactionType: JF_TRAN;

  beforeEach(() => {
    transactionType = new JF_TRAN();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('E');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.JF_TRANSFER);
  });

  it('#contributionPurposeDescripReadonly() should return constant', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('Transfer of JF Proceeds');
  });
});
