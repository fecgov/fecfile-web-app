import { OPERATING_EXPENDITURE } from './OPERATING_EXPENDITURE.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { ReportTypes } from '../reports/report.model';

describe('OPERATING_EXPENDITURE', () => {
  let transactionType: OPERATING_EXPENDITURE;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE);
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
