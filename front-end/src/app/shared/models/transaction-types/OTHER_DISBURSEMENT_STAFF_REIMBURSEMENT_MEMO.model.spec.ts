import { TransactionType } from 'app/shared/models/transaction-type.model';
import { ReportTypes } from '../reports/report.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO } from './OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO.model';

describe('OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO', () => {
  let transactionType: OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });

  it('#hasElectionInformation() should return true for F3 report type', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#hasElectionInformation() should return false for F3X', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(result).toBe(false);
  });
});
