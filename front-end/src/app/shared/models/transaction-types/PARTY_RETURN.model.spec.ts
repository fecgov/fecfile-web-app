import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { PARTY_RETURN } from './PARTY_RETURN.model';
import { ReportTypes } from '../reports/report-types.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('PARTY_RETURN', () => {
  let transactionType: PARTY_RETURN;

  beforeEach(() => {
    transactionType = new PARTY_RETURN();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11B');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_RETURN);
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
