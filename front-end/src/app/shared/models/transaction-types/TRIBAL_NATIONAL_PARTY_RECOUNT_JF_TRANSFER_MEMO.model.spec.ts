import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { Transaction } from '../transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO);
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: Transaction | undefined = transaction.transactionType?.getNewTransaction();
    expect(txn).toBeTruthy();
    if (txn) {
      expect(txn.form_type).toBe('SA17');
      expect(txn.transaction_type_identifier).toBe(
        ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      );
    }
  });

  it('#generatePurposeDescription() should generate a string', () => {
    transaction.parent_transaction = {
      contributor_organization_name: 'ABC',
    } as SchATransaction;
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount/Legal Proceedings Account JF Memo: ABC');
  });
});
