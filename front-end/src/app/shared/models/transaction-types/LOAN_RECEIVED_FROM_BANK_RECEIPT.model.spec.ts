import { LOAN_RECEIVED_FROM_BANK_RECEIPT } from './LOAN_RECEIVED_FROM_BANK_RECEIPT.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('LOAN_RECEIVED_FROM_BANK_RECEIPT', () => {
  let transactionType: LOAN_RECEIVED_FROM_BANK_RECEIPT;

  beforeEach(() => {
    transactionType = new LOAN_RECEIVED_FROM_BANK_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchATransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SA13');
    expect(transaction.aggregation_group).toBe(AggregationGroups.GENERAL);
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
