import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { PAC_RECOUNT_RECEIPT } from './PAC_RECOUNT_RECEIPT.model';

describe('PAC_RECOUNT_RECEIPT', () => {
  let transactionType: PAC_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new PAC_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account');
  });
});
