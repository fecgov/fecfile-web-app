import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupFG } from '../transaction-groups/transaction-group-fg.model';

describe('PAC_EARMARK_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupFG);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11C');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const childTransaction = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_MEMO) as SchATransaction;
    childTransaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransaction.contributor_first_name = 'Joe';
    childTransaction.contributor_last_name = 'Smith';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked through Joe Smith');
  });
});
