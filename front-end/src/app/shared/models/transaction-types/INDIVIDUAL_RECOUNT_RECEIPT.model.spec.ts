import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { INDIVIDUAL_RECOUNT_RECEIPT } from './INDIVIDUAL_RECOUNT_RECEIPT.model';

describe('INDIVIDUAL_RECOUNT_RECEIPT', () => {
  let transactionType: INDIVIDUAL_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a F3 SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction(ReportTypes.F3);
    expect(txn.form_type).toBe('SA15');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT);
  });

  it('#factory() should return a F3X SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction(ReportTypes.F3X);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return appropriate retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe(`Recount Account`);
  });

  it('#hasElectionInformation() should return true for F3 report type', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#hasElectionInformation() should return false for F3X', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(result).toBe(false);
  });

  it('#isReattributable() should return true for F3', () => {
    const result = transactionType.isReattributable(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#isReattributable() should return false for F3X', () => {
    const result = transactionType.isReattributable(ReportTypes.F3X);
    expect(result).toBe(false);
  });
});
