import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { RETURN_RECEIPT } from './RETURN_RECEIPT.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('RETURN_RECEIPT', () => {
  let transactionType: RETURN_RECEIPT;

  beforeEach(() => {
    transactionType = new RETURN_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
  });
  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
