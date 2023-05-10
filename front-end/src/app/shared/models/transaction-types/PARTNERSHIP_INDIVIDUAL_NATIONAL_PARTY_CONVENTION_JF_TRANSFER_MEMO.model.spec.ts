import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a.model';
import { Transaction } from '../transaction.model';

describe('PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).parent_transaction = getTestTransactionByType(
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT
    );
    ((transaction.parent_transaction as SchATransaction).parent_transaction as SchATransaction).contributor_organization_name = 'Test Committee';
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction.transactionType?.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should return appropriate retval', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Pres. Nominating Convention Account JF Memo: ' +
      'Test Committee');
  });

  it('#generatePurposeDescription() should shrink long description', () => {
    ((transaction.parent_transaction as SchATransaction).parent_transaction as SchATransaction).contributor_organization_name =
      'Super Duper Extra Super Long Committee Name That Needs to Shrink';
    transaction.children = [{} as SchATransaction];
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Pres. Nominating Convention Account JF Memo: Super Duper Extra Super Long Committee Name That Nee...'
    );
  });
});
