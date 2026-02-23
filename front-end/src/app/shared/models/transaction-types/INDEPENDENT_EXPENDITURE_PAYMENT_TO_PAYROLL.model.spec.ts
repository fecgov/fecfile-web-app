import { TransactionType } from 'app/shared/models/transaction-type.model';
import { INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL } from './INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleETransactionTypes } from '../type-enums';

describe('INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL', () => {
  let transactionType: INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL;

  beforeEach(() => {
    transactionType = new INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchETransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL);
  });

  it('#generatePurposeDescription() should not be defined', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);

    expect((transactionType as TransactionType).generatePurposeDescription?.(txn)).toEqual('Payroll: See Below');
  });
});
