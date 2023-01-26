import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';
import { PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO } from './PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO.model';

describe('PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT();
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
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate expected retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount/Legal Proceedings Account ' +
      '(Partnership attributions do not require itemization)');
  });

  
  it('#generatePurposeDescription() should reflect child', () => {
    const childTransactionType: PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO = 
      new PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO();
    childTransactionType.transaction = childTransactionType.getNewTransaction();
    childTransactionType.transaction.contributor_last_name = 'test';
    transactionType.childTransactionType = childTransactionType;
    const descripwithChildren = transactionType.generatePurposeDescription();
    expect(descripwithChildren).toBe('Recount/Legal Proceedings Account ' + 
      '(See Partnership Attribution(s) below)');

    transactionType.childTransactionType = undefined;
    const descripwithNoChildren = transactionType.generatePurposeDescription();
    expect(descripwithNoChildren).toBe('Recount/Legal Proceedings Account ' + 
      '(Partnership attributions do not require itemization)');
  });
  
  
});
