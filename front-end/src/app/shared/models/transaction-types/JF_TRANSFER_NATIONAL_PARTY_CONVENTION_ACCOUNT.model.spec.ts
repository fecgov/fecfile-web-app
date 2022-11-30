import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT } from './JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT.model';

describe('JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT', () => {
  let transactionType: JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('E');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT
    );
  });

  it('#generateContributionPurposeDescription() should return appropriate retval', () => {
    const descrip = transactionType.generateContributionPurposeDescription();
    expect(descrip).toBe(`Pres. Nominating Convention Account Transfer of JF Proceeds`);
  });
});
