import { OFFSET_TO_OPERATING_EXPENDITURES } from './OFFSET_TO_OPERATING_EXPENDITURES.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('OFFSET_TO_OPERATING_EXPENDITURES', () => {
  let transactionType: OFFSET_TO_OPERATING_EXPENDITURES;

  beforeEach(() => {
    transactionType = new OFFSET_TO_OPERATING_EXPENDITURES();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA15');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
