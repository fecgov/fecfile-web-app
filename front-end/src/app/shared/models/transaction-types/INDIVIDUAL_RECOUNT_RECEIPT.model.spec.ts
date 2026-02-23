import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { INDIVIDUAL_RECOUNT_RECEIPT } from './INDIVIDUAL_RECOUNT_RECEIPT.model';
import { ScheduleATransactionTypes } from '../type-enums';

describe('INDIVIDUAL_RECOUNT_RECEIPT', () => {
  let transactionType: INDIVIDUAL_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return appropriate retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe(`Recount Account`);
  });
});
