import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TRIBAL_RECOUNT_RECEIPT } from './TRIBAL_RECOUNT_RECEIPT.model';

describe('TRIBAL_RECOUNT_RECEIPT', () => {
  let transactionType: TRIBAL_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new TRIBAL_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a F3 SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction(ReportTypes.F3);
    expect(txn.form_type).toBe('SA15');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT);
  });

  it('#factory() should return a F3X SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction(ReportTypes.F3X);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account');
  });

  it('#hasElectionInformation() should return true for F3 report type', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#hasElectionInformation() should return false for F3X', () => {
    const result = transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(result).toBe(false);
  });

  it('#isReattributable() should return false', () => {
    const result = transactionType.isReattributable();
    expect(result).toBe(false);
  });
});
