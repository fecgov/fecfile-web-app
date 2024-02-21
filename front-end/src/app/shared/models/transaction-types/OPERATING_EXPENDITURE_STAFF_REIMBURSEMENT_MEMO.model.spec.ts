import { OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO } from './OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';

describe('OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO', () => {
  let transactionType: OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
