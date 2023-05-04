import { INDIVIDUAL_RECEIPT } from './INDIVIDUAL_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a';

describe('INDIVIDUAL_RECEIPT', () => {
  let transactionType: INDIVIDUAL_RECEIPT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECEIPT(new TransactionGroupA());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
