import { C2_LOAN_GUARANTOR } from './C2_LOAN_GUARANTOR.model';
import { SchC2Transaction, ScheduleC2TransactionTypes } from '../schc2-transaction.model';

describe('C2_LOAN_GUARANTOR', () => {
  let transactionType: C2_LOAN_GUARANTOR;

  beforeEach(() => {
    transactionType = new C2_LOAN_GUARANTOR();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('C1');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchC2Transaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SC1/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
