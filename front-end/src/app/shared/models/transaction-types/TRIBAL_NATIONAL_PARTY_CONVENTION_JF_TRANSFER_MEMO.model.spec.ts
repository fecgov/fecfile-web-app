import { Transaction } from '../transaction.model';
import { SchATransaction } from '../scha-transaction.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO', () => {
  let transaction: Transaction;

  beforeEach(async () => {
    transaction = await TransactionUtils.createNewTransactionByIdentifier(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    );
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    transaction.parent_transaction = {
      contributor_organization_name: 'ABC',
    } as SchATransaction;
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe(
      `Pres. Nominating Convention Account JF Memo: ${
        (transaction.parent_transaction as SchATransaction)?.contributor_organization_name
      }`,
    );
  });
});
