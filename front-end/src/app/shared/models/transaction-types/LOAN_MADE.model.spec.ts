import { LOAN_MADE } from './LOAN_MADE.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('LOAN_MADE', () => {
  let transactionType: LOAN_MADE;

  beforeEach(() => {
    transactionType = new LOAN_MADE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SB27');
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.LOAN_MADE);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
