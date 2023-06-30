import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';

describe('PARTNERSHIP_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.PARTNERSHIP_RECEIPT
    ).getNewTransaction() as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupD);
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
