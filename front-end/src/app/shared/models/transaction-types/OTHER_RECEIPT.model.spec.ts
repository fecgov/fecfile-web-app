import { OTHER_RECEIPT } from './OTHER_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';

describe('OTHER_RECEIPT', () => {
  let transactionType: OTHER_RECEIPT;

  beforeEach(() => {
    transactionType = new OTHER_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('C');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.OTHER_RECEIPTS);
  });
  it('#generateContributionPurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generateContributionPurposeDescription).toBe(undefined);
  });
});
