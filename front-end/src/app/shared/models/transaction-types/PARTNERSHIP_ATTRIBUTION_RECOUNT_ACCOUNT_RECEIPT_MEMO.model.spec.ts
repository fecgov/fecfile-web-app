import { PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO } from './PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { ReportTypes } from '../reports/report.model';

describe('PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO', () => {
  let transactionType: PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO,
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account Partnership Attribution');
  });

  it.each([
    [ReportTypes.F3, true],
    [ReportTypes.F3X, false],
  ])('#hasElectionInformation() should return $expected for $reportType', (reportType, expected) => {
    const result = transactionType.hasElectionInformation(reportType);
    expect(result).toBe(expected);
  });
});
