import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT } from './JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model';

describe('JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT', () => {
  let transactionType: JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT
    );
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Headquarters Buildings Account Transfer of JF Proceeds');
  });
});
