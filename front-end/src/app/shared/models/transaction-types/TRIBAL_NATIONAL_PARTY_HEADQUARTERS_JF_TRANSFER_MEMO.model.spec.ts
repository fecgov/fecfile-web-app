import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { Transaction } from '../transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO', () => {
  const transaction: Transaction = getTestTransactionByType(
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
  );

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    transaction.parent_transaction = {
      contributor_organization_name: 'ABC',
    } as SchATransaction;
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Headquarters Buildings Account JF Memo: ABC');
  });
});
