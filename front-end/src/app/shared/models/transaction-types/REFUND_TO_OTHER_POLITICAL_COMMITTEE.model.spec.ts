import { TransactionType } from 'app/shared/models/transaction-type.model';
import { REFUND_TO_OTHER_POLITICAL_COMMITTEE } from './REFUND_TO_OTHER_POLITICAL_COMMITTEE.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';

describe('REFUND_TO_OTHER_POLITICAL_COMMITTEE', () => {
  let transactionType: REFUND_TO_OTHER_POLITICAL_COMMITTEE;

  beforeEach(() => {
    transactionType = new REFUND_TO_OTHER_POLITICAL_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA16');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
