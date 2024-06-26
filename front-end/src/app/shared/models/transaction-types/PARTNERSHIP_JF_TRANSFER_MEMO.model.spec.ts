import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_JF_TRANSFER_MEMO', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transaction).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  xit('#factory() should return a SchBTransaction', () => {
    expect(transaction.form_type).toBe('SA12');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('JF Memo: Test Org (Partnership attributions do not meet itemization threshold)');
  });

  it('#generatePurposeDescription() should shrink long description', () => {
    (transaction.parent_transaction as SchATransaction).contributor_organization_name =
      'Super Duper Long Committee Name That Needs to Shrink';
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      'JF Memo: Super Duper Long Committee ... (Partnership attributions do not meet itemization threshold)',
    );
  });
});
