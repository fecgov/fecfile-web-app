import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).parent_transaction = getTestTransactionByType(
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER
    );
    (
      (transaction.parent_transaction as SchATransaction).parent_transaction as SchATransaction
    ).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction.transactionType?.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should return appropriate retval', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(`Headquarters Buildings Account JF Memo: Test Org (Partnership Attribution)`);
  });

  it('#generatePurposeDescription() should shrink long description', () => {
    (
      (transaction.parent_transaction as SchATransaction).parent_transaction as SchATransaction
    ).contributor_organization_name = 'Super Duper Hyper Very Really Long Committee Name That Needs to Shrink';
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Headquarters Buildings Account JF Memo: Super Duper Hyper Very Really L... (Partnership Attribution)'
    );
  });
});
