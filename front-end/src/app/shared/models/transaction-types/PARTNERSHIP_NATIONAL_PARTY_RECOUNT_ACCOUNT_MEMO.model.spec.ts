import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';
import { PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO } from './PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO.model';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';

describe('PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT
    );
    (transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe(`Recount/Legal Proceedings Account Partnership Attribution`);
  });
});
