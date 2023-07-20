import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';

describe('PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    if (transactionType) {
      expect(transactionType.scheduleId).toBe('A');
    }
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate expected retval', () => {
    const txn = transactionType.getNewTransaction();
    const descrip = transactionType.generatePurposeDescription(txn);
    expect(descrip).toBe('Recount/Legal Proceedings Account (Partnership attributions do not meet itemization threshold)');
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const txn = transactionType.getNewTransaction();
    let descrip = transactionType.generatePurposeDescription(txn);
    expect(descrip).toBe('Recount/Legal Proceedings Account (Partnership attributions do not meet itemization threshold)');

    txn.children = [transactionType.getNewTransaction()];
    descrip = transactionType.generatePurposeDescription(txn);
    expect(descrip).toBe('Recount/Legal Proceedings Account (See Partnership Attribution(s) below)');
  });
});
