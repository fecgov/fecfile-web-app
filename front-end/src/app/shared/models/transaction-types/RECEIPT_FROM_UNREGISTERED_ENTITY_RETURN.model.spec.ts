import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN } from './RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN.model';
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

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
