import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { Transaction } from '../transaction.model';

describe('PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO', () => {
  let transaction: Transaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Committee';
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Pres. Nominating Convention Account JF Memo: Test ' + 'Committee (Partnership attributions do not meet...'
    );
  });

  it('#generatePurposeDescription() should shrink long description', () => {
    (transaction.parent_transaction as SchATransaction).contributor_organization_name =
      'Super Duper Long Committee Name That Needs to Shrink';
    transaction.children = [{} as SchATransaction];
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Pres. Nominating Convention Account JF Memo: Super Duper ' + 'L... (See Partnership Attribution(s) below)'
    );
  });
});
