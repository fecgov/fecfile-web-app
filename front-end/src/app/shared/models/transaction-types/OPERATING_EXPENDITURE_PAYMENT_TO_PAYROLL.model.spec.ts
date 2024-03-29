import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL } from './OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL.model';

describe('OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL', () => {
  let transactionType: OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Payroll: See Below');
  });
});
