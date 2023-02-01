import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { PAC_EARMARK_MEMO } from './PAC_EARMARK_MEMO.model';
import { PAC_EARMARK_RECEIPT } from './PAC_EARMARK_RECEIPT.model';

describe('PAC_EARMARK_RECEIPT', () => {
  let transactionType: PAC_EARMARK_RECEIPT;

  beforeEach(() => {
    transactionType = new PAC_EARMARK_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    if (transactionType) {
      expect(transactionType.scheduleId).toBe('A');
      expect(transactionType.componentGroupId).toBe('FG');
    }
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11C');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const childTransactionType: PAC_EARMARK_MEMO = new PAC_EARMARK_MEMO();
    childTransactionType.transaction = childTransactionType.getNewTransaction();
    childTransactionType.transaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransactionType.transaction.contributor_first_name = 'Joe';
    childTransactionType.transaction.contributor_last_name = 'Smith';

    transactionType.childTransactionType = childTransactionType;
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Earmarked through Joe Smith');
  });
});
