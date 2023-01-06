import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PAC_RECOUNT_RECEIPT } from './PAC_RECOUNT_RECEIPT.model';

describe('PAC_RECOUNT_RECEIPT', () => {
  let transactionType: PAC_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new PAC_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account');
  });
});
