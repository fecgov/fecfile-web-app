import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { REFUND_TO_OTHER_POLITICAL_COMMITTEE } from './REFUND_TO_OTHER_POLITICAL_COMMITTEE.model';

describe('REFUND_TO_OTHER_POLITICAL_COMMITTEE', () => {
  let transactionType: REFUND_TO_OTHER_POLITICAL_COMMITTEE;

  beforeEach(() => {
    transactionType = new REFUND_TO_OTHER_POLITICAL_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA16');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
