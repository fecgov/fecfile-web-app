import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTY_RECEIPT } from './PARTY_RECEIPT.model';
import { ReportTypes } from '../reports/report.model';

describe('PARTY_RECEIPT', () => {
  let transactionType: PARTY_RECEIPT;

  beforeEach(() => {
    transactionType = new PARTY_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11B');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_RECEIPT);
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

  it('#isReattributable() should return false', () => {
    const result = transactionType.isReattributable;
    expect(result).toBe(false);
  });
});
