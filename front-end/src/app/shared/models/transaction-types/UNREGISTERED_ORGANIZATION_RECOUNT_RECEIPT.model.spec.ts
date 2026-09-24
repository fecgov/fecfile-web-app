import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT } from './UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT.model';

describe('UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT', () => {
  let transactionType: UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA15');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.UNREGISTERED_ORGANIZATION_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account');
  });

  it('#isReattributable() should return false', () => {
    const result = transactionType.isReattributable();
    expect(result).toBe(false);
  });
});
