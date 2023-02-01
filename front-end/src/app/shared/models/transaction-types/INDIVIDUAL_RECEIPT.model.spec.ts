import { INDIVIDUAL_RECEIPT } from './INDIVIDUAL_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';

describe('INDIVIDUAL_RECEIPT', () => {
  let transactionType: INDIVIDUAL_RECEIPT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
  });

  it('#purposeDescriptionGenerator() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
