import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { EARMARK_MEMO_CONVENTION_ACCOUNT } from './EARMARK_MEMO_CONVENTION_ACCOUNT.model';
import { EARMARK_RECEIPT_CONVENTION_ACCOUNT } from './EARMARK_RECEIPT_CONVENTION_ACCOUNT.model';

describe('EARMARK_RECEIPT_CONVENTION_ACCOUNT', () => {
  let transactionType: EARMARK_RECEIPT_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new EARMARK_RECEIPT_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    if (transactionType) {
      expect(transactionType.scheduleId).toBe('A');
      expect(transactionType.componentGroupId).toBe('AG');
    }
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION
    );
  });

  it('#purposeDescriptionGenerator() should generate empty string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('');
  });

  it('#purposeDescriptionGenerator() should reflect child', () => {
    const childTransactionType: EARMARK_MEMO_CONVENTION_ACCOUNT = new EARMARK_MEMO_CONVENTION_ACCOUNT();
    childTransactionType.transaction = childTransactionType.getNewTransaction();
    childTransactionType.transaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransactionType.transaction.contributor_first_name = 'Joe';
    childTransactionType.transaction.contributor_last_name = 'Smith';

    transactionType.childTransactionType = childTransactionType;
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account - Earmarked Through Joe Smith');
  });
});
