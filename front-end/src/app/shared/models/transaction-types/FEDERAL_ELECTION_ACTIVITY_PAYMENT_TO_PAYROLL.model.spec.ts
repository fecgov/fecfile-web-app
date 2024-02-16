import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL } from './FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL.model';

describe('FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL
    );
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Payroll: See Below');
  });
});
