import { ScheduleATransactionTypes } from '../scha-transaction.model';
//import { EARMARK_MEMO } from './EARMARK_MEMO.model';
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
      expect(transactionType.componentGroupId).toBe('D');
    }
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate expected retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount/Legal Proceedings Account ' +
      '(Partnership attributions do not require itemization)');
  });

  /*
  it('#generatePurposeDescription() should reflect child', () => {
    const childTransactionType: EARMARK_MEMO = new EARMARK_MEMO();
    childTransactionType.transaction = childTransactionType.getNewTransaction();
    childTransactionType.transaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransactionType.transaction.contributor_first_name = 'Joe';
    childTransactionType.transaction.contributor_last_name = 'Smith';

    transactionType.childTransactionType = childTransactionType;
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Earmarked through Joe Smith');
  });
  */
  
});
