import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';

describe('JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount/Legal Proceedings Account Transfer of JF Proceeds');
  });
});
