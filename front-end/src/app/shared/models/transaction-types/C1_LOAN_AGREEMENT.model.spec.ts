import { C1_LOAN_AGREEMENT } from './C1_LOAN_AGREEMENT.model';
import { SchC1Transaction, ScheduleC1TransactionTypes } from '../schc1-transaction.model';
import { AggregationGroups } from '../transaction.model';

describe('C1_LOAN_AGREEMENT', () => {
  let transactionType: C1_LOAN_AGREEMENT;

  beforeEach(() => {
    transactionType = new C1_LOAN_AGREEMENT();
    // transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK) as SchCTransaction;
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('C1');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchC1Transaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SC1/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
