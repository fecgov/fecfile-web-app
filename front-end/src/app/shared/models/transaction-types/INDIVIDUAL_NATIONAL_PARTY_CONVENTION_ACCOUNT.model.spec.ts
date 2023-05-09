import { INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT } from './INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a.model';

describe('INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT
    );
  });

  it('#generatePurposeDescription()', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Pres. Nominating Convention Account');
  });
});
