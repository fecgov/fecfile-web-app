import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleETransactionTypes } from '../type-enums';
import { INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO } from './INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO.model';

describe('INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO', () => {
  let transactionType: INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO;

  beforeEach(() => {
    transactionType = new INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchETransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO,
    );
  });
});
