import { PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT } from './PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PAC_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT', () => {
  let transactionType: PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Headquarters Buildings Account');
  });
});
