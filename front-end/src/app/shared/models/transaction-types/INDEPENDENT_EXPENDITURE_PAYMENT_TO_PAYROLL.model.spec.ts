import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchETransaction, ScheduleETransactionTypes } from '../sche-transaction.model';
import { INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL } from './INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL.model';

describe('INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL', () => {
  let transactionType: INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchETransaction', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toEqual('Payroll: See Below');
  });
});
