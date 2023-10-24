import { RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN } from './RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';

describe('RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN', () => {
  let transactionType: RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN;

  beforeEach(() => {
    transactionType = new RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
