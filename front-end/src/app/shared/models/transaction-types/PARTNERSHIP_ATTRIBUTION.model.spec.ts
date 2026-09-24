import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_ATTRIBUTION', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
    ).getNewTransaction() as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn = transaction.transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Partnership Attribution');
  });

  it('#hasElectionInformation() should return true for F3 report type', () => {
    const result = transaction.transactionType.hasElectionInformation(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#hasElectionInformation() should return false for F3X', () => {
    const result = transaction.transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(result).toBe(false);
  });

  it('#isReattributable() should return true for F3X', () => {
    const result = transaction.transactionType.isReattributable(ReportTypes.F3X);
    expect(result).toBe(true);
  });

  it('#isReattributable() should return false for F3', () => {
    const result = transaction.transactionType.isReattributable(ReportTypes.F3);
    expect(result).toBe(false);
  });
});
