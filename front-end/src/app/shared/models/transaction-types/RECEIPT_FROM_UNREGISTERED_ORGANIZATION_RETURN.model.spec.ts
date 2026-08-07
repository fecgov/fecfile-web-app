import { RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN } from './RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { ScheduleATransactionTypes } from '../transaction/schedule-a/schedule-a-transaction-types.model';

describe('RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN', () => {
  let transactionType: RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN;

  beforeEach(() => {
    transactionType = new RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN,
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
