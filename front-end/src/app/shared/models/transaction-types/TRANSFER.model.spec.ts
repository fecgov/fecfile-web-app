import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { TRANSFER } from './TRANSFER.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('TRANSFER', () => {
  let transactionType: TRANSFER;

  beforeEach(() => {
    transactionType = new TRANSFER();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRANSFER);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
