import { OTHER_RECEIPT } from './OTHER_RECEIPT.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('OTHER_RECEIPT', () => {
  let transactionType: OTHER_RECEIPT;

  beforeEach(() => {
    transactionType = new OTHER_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.OTHER_RECEIPTS);
  });
  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
