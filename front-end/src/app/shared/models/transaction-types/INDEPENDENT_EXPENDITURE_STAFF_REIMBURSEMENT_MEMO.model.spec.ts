import { SchETransaction, ScheduleETransactionTypes } from '../sche-transaction.model';
import { INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO } from './INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO.model';

describe('INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO', () => {
  let transactionType: INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO;

  beforeEach(() => {
    transactionType = new INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchETransaction', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO,
    );
  });
});
