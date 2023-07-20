import { INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription()', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Recount/Legal Proceedings Account');
  });
});
