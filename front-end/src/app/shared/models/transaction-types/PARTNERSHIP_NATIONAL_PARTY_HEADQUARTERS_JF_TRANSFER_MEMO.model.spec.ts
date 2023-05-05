import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transaction).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
    expect(transaction.transactionType?.componentGroupId).toBe('D');
  });

  xit('#factory() should return a SchBTransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Headquarters Buildings Account JF Memo: Tes... (Partnership attributions do not require itemization)'
    );
  });

  it('#generatePurposeDescription() should shrink long description', () => {
    (transaction.parent_transaction as SchATransaction).contributor_organization_name =
      'Super Duper Long Committee Name That Needs to Shrink';
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'Headquarters Buildings Account JF Memo: Sup... (Partnership attributions do not require itemization)'
    );
  });
});
