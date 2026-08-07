import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchETransaction } from '../transaction/schedule-e/sche-transaction.model';
import { INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT } from './INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT.model';
import { ScheduleETransactionTypes } from '../transaction/schedule-e/schedule-e-transaction-types.model';

describe('INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT', () => {
  let transactionType: INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchETransaction', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();
    expect((transactionType as TransactionType).generatePurposeDescription?.(txn)).toEqual(
      'Reimbursement memo entries do not meet itemization threshold.',
    );
    txn.children = [
      {
        itemized: true,
      } as SchETransaction,
    ];
    expect(transactionType.generatePurposeDescription(txn)).toBe('Reimbursement Memo: See Below');
  });
});
