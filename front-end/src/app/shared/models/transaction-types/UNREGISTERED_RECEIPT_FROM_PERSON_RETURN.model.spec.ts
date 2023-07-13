import { UNREGISTERED_RECEIPT_FROM_PERSON_RETURN } from './UNREGISTERED_RECEIPT_FROM_PERSON_RETURN.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';

describe('UNREGISTERED_RECEIPT_FROM_PERSON_RETURN', () => {
  let transactionType: UNREGISTERED_RECEIPT_FROM_PERSON_RETURN;

  beforeEach(() => {
    transactionType = new UNREGISTERED_RECEIPT_FROM_PERSON_RETURN();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURN);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
