import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a.model';

describe('PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction?.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount/Legal Proceedings Account Partnership Attribution');
  });
});
