import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL } from './OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL.model';

describe('OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL', () => {
  let transactionType: OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Payroll: See Below');
  });
});
