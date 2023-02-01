import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { EARMARK_MEMO } from './EARMARK_MEMO.model';
import { EARMARK_RECEIPT } from './EARMARK_RECEIPT.model';

describe('EARMARK_RECEIPT', () => {
  let transactionType: EARMARK_RECEIPT;

  beforeEach(() => {
    transactionType = new EARMARK_RECEIPT();
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
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('');
  });

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
});
