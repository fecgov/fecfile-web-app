import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { Transaction } from '../transaction.model';
import { TransactionTypeUtils } from '../../utils/transaction-type.utils';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';

describe('TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    ).getNewTransaction();
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupD);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    transaction.parent_transaction = {
      contributor_organization_name: 'ABC',
    } as SchATransaction;
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      `Pres. Nominating Convention Account JF Memo: ${
        (transaction.parent_transaction as SchATransaction)?.contributor_organization_name
      }`
    );
  });
});
