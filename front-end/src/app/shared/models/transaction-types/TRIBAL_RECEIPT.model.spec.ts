import { ReportTypes } from '../reports/report-types.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';
import { TRIBAL_RECEIPT } from './TRIBAL_RECEIPT.model';

describe('TRIBAL_RECEIPT', () => {
  let transactionType: TRIBAL_RECEIPT;

  beforeEach(() => {
    transactionType = new TRIBAL_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Tribal Receipt');
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
    const result = transactionType.isReattributable;
    expect(result).toBe(false);
  });
});
