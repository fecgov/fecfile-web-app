import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { Transaction } from '../transaction.model';
import { TransactionTypeUtils } from '../../utils/transaction-type.utils';

describe('TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
    ).getNewTransaction();
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction.transactionType?.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      `Headquarters Buildings Account JF Memo: ${
        (transaction.parent_transaction as SchATransaction)?.contributor_organization_name
      }`
    );
  });
});
