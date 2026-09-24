import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_RECEIPT', () => {
  let transaction: SchATransaction;

  beforeEach(() => {
    transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
    ).getNewTransaction() as SchATransaction;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    expect(transaction.form_type).toBe('SA11AI');
    expect(transaction.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    let descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Partnership attributions do not meet itemization threshold');

    transaction.children = [{ ...transaction } as SchATransaction];
    transaction.children[0].itemized = true;
    descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('See Partnership Attribution(s) below');
  });

  it('#hasElectionInformation() should return true for F3 report type', () => {
    const result = transaction.transactionType.hasElectionInformation(ReportTypes.F3);
    expect(result).toBe(true);
  });

  it('#hasElectionInformation() should return false for F3X', () => {
    const result = transaction.transactionType.hasElectionInformation(ReportTypes.F3X);
    expect(result).toBe(false);
  });

  it('#isReattributable() should return false', () => {
    const result = transaction.transactionType.isReattributable();
    expect(result).toBe(false);
  });
});
