import { UNREGISTERED_RECEIPT_FROM_PERSON } from './UNREGISTERED_RECEIPT_FROM_PERSON.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d';

describe('UNREGISTERED_RECEIPT_FROM_PERSON', () => {
  let transactionType: UNREGISTERED_RECEIPT_FROM_PERSON;

  beforeEach(() => {
    transactionType = new UNREGISTERED_RECEIPT_FROM_PERSON();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupD);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON);
  });
  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
