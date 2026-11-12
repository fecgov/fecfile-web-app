import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getTestTransactionByType } from 'app/shared/utils/unit-test.utils';
import { Transaction } from '../transaction.model';
import { TransactionType } from '../transaction-type.model';
import { ReportTypes } from '../reports/report.model';

describe('PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT', () => {
  let transaction: SchATransaction;
  let transactionType: TransactionType;

  beforeEach(() => {
    transaction = getTestTransactionByType(
      ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
    ) as SchATransaction;
    transactionType = transaction.transactionType;
  });

  it('should create an instance', () => {
    expect(transaction.transactionType).toBeTruthy();
    expect(transaction.transactionType?.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction | undefined = transaction.transactionType?.getNewTransaction() as SchATransaction;
    expect(txn?.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    let descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount Account (Partnership attributions do not meet itemization threshold)');

    transaction.children = [transaction.transactionType?.getNewTransaction() as Transaction];
    transaction.children[0].itemized = true;
    descrip = transaction.transactionType?.generatePurposeDescription?.(transaction);
    expect(descrip).toBe('Recount Account (See Partnership Attribution(s) below)');
  });

  it.each([
    [ReportTypes.F3, true],
    [ReportTypes.F3X, false],
  ])('#hasElectionInformation() should return $expected for $reportType', (reportType, expected) => {
    const result = transactionType.hasElectionInformation(reportType);
    expect(result).toBe(expected);
  });

  it('#isReattributable() should return false', () => {
    const result = transactionType.isReattributable;
    expect(result).toBe(false);
  });
});
