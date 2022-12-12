import { TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT } from './TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT', () => {
  let transactionType: TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT;

  beforeEach(() => {
    transactionType = new TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT
    );
  });

  it('#generateContributionPurposeDescription() should generate a string', () => {
    const descrip = transactionType.generateContributionPurposeDescription();
    expect(descrip).toBe('Headquarters Buildings Account');
  });
});
