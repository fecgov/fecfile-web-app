import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT } from './PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT.model';
import { PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT_MEMO } from './PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT_MEMO.model';

describe('PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT_MEMO', () => {
  let transactionType: PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT_MEMO;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT_MEMO();
    transactionType.transaction = transactionType.getNewTransaction();
    transactionType.transaction.parent_transaction =
      new PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT().getNewTransaction();
    (transactionType.transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account Partnership Attribution');
  });
});
