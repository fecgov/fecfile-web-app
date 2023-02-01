import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TRANSFER } from './TRANSFER.model';

describe('TRANSFER', () => {
  let transactionType: TRANSFER;

  beforeEach(() => {
    transactionType = new TRANSFER();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRANSFER);
  });

  it('#purposeDescriptionGenerator() should not be defined', () => {
    expect((transactionType as TransactionType).purposeDescriptionGenerator).toBe(undefined);
  });
});
