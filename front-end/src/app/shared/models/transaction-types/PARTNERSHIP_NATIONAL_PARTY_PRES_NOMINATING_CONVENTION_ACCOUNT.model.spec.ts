import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT } from './PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT.model';

describe('PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    if (transactionType) {
      expect(transactionType.scheduleId).toBe('A');
      expect(transactionType.componentGroupId).toBe('D');
    }
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_PRES_NOMINATING_CONVENTION_ACCOUNT
    );
  });

  it('#generatePurposeDescription() should generate expected retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account (Partnership attributions do not require itemization)');
  });

  it('#generatePurposeDescription() should generate a string', () => {
    transactionType.transaction = transactionType.getNewTransaction();
    let descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account (Partnership attributions do not require itemization)');

    transactionType.transaction.children = [transactionType.getNewTransaction()];
    descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account (See Partnership Attribution(s) below)');
  });
});
