import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO } from './PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO.model';

describe('PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO', () => {
  let transactionType: PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO,
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe(`Headquarters Buildings Account Partnership Attribution`);
  });
});
