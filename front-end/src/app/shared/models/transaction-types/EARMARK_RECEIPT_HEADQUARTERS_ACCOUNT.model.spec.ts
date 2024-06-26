import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ContactTypes } from '../contact.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    ) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    );
  });

  it('#generatePurposeDescription() should generate empty string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('');
  });

  it('#generatePurposeDescription() should reflect child', () => {
    const childTransaction = getTestTransactionByType(
      ScheduleATransactionTypes.EARMARK_MEMO_HEADQUARTERS_ACCOUNT,
    ) as SchATransaction;
    childTransaction.entity_type = ContactTypes.INDIVIDUAL;
    childTransaction.contributor_first_name = 'Joe';
    childTransaction.contributor_last_name = 'Smith';
    transaction.children = [childTransaction];

    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Headquarters Buildings Account - Earmarked Through Joe Smith');
  });
});
