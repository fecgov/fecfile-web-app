import { TransactionType } from 'app/shared/models/transaction-type.model';
import { PAC_RECEIPT } from './PAC_RECEIPT.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('PAC_RECEIPT', () => {
  let transactionType: PAC_RECEIPT;

  beforeEach(() => {
    transactionType = new PAC_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA11C');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_RECEIPT);
  });
  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
