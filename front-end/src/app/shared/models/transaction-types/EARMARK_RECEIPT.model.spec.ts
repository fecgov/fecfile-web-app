import { ContactTypes } from '../contacts/contact-types.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('EARMARK_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_RECEIPT) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11AI');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const childTransaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_MEMO) as SchATransaction;
    childTransaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransaction.contributor_first_name = 'Joe';
    childTransaction.contributor_last_name = 'Smith';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Earmarked through Joe Smith');
  });
});
