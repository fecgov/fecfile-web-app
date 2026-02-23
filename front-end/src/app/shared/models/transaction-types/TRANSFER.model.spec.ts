import { TransactionType } from 'app/shared/models/transaction-type.model';
import { TRANSFER } from './TRANSFER.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';

describe('TRANSFER', () => {
  let transactionType: TRANSFER;

  beforeEach(() => {
    transactionType = new TRANSFER();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA12');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRANSFER);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
