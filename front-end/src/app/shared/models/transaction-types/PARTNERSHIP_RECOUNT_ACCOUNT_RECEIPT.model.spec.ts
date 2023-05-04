import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { Transaction } from '../transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d';

describe('PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT
    ) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupD);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction | undefined = transaction.transactionType?.getNewTransaction() as SchATransaction;
    expect(txn?.form_type).toBe('SA17');
    expect(txn?.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    let descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount Account (Partnership attributions do not require itemization)');

    transaction.children = [transaction.transactionType?.getNewTransaction() as Transaction];
    descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount Account (See Partnership Attribution(s) below)');
  });
});
