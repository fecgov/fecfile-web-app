import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { SchATransaction } from '../scha-transaction.model';
import { ScheduleATransactionTypes } from '../type-enums';

describe('PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(async () => {
    transaction = (await getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
    )) as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = (await TransactionUtils.createNewTransaction(transaction.transactionType)) as SchATransaction;
    expect(txn?.form_type).toBe('SA17');
    expect(txn?.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', async () => {
    let descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount Account (Partnership attributions do not meet itemization threshold)');

    transaction.children = [await TransactionUtils.createNewTransaction(transaction.transactionType)];
    descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount Account (See Partnership Attribution(s) below)');
  });
});
