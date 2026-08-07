import { OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO } from './OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO', () => {
  let transactionType: OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
