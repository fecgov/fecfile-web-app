import { LOAN_RECEIVED_FROM_BANK_RECEIPT } from './LOAN_RECEIVED_FROM_BANK_RECEIPT.model';
import { AggregationGroups, ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('LOAN_RECEIVED_FROM_BANK_RECEIPT', () => {
  let transactionType: LOAN_RECEIVED_FROM_BANK_RECEIPT;

  beforeEach(() => {
    transactionType = new LOAN_RECEIVED_FROM_BANK_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA13');
    expect(txn.aggregation_group).toBe(AggregationGroups.GENERAL);
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
