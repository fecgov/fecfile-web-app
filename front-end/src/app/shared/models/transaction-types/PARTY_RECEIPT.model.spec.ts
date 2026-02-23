import { TransactionType } from 'app/shared/models/transaction-type.model';
import { PARTY_RECEIPT } from './PARTY_RECEIPT.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';

describe('PARTY_RECEIPT', () => {
  let transactionType: PARTY_RECEIPT;

  beforeEach(() => {
    transactionType = new PARTY_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA11B');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_RECEIPT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
