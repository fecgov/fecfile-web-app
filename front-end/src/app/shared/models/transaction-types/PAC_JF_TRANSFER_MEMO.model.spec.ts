import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PAC_JF_TRANSFER_MEMO', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
    ) as SchATransaction;
    (transaction.parent_transaction as SchATransaction).contributor_organization_name = 'Test Org';
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA12');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO);
  });

  it('#generatePurpotransaction.seDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('JF Memo: Test Org');
  });
});
