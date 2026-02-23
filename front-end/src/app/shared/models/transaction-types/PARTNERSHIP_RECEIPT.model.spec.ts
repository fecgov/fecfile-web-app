import { SchATransaction } from '../scha-transaction.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('PARTNERSHIP_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(async () => {
    transaction = (await getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT)) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11AI');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    let descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Partnership attributions do not meet itemization threshold');

    transaction.children = [{ ...transaction } as SchATransaction];
    descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('See Partnership Attribution(s) below');
  });
});
