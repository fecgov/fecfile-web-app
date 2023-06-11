import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupH } from '../transaction-groups/transaction-group-h.model';
import { REFUND_TO_FEDERAL_CANDIDATE } from './REFUND_TO_FEDERAL_CANDIDATE.model';

describe('REFUND_TO_FEDERAL_CANDIDATE', () => {
  let transactionType: REFUND_TO_FEDERAL_CANDIDATE;

  beforeEach(() => {
    transactionType = new REFUND_TO_FEDERAL_CANDIDATE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupH);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA16');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
