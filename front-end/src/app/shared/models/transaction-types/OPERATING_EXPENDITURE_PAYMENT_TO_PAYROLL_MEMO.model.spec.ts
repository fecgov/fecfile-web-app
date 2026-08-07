import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO } from './OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO', () => {
  let transactionType: OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO,
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
