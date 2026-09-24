import { TransactionType } from 'app/shared/models/transaction-type.model';
import { ReportTypes } from '../reports/report.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { RETURN_RECEIPT } from './RETURN_RECEIPT.model';

describe('RETURN_RECEIPT', () => {
  let transactionType: RETURN_RECEIPT;

  beforeEach(() => {
    transactionType = new RETURN_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
  });
  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });

  it('should show election information only for Form 3', () => {
    expect(transactionType.hasElectionInformation(ReportTypes.F3)).toBe(true);
    expect(transactionType.hasElectionInformation(ReportTypes.F3X)).toBe(false);
  });
});
