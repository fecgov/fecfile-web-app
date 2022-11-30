import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TRIBAL_RECOUNT_RECEIPT } from './TRIBAL_RECOUNT_RECEIPT.model';

describe('TRIBAL_RECOUNT_RECEIPT', () => {
  let transactionType: TRIBAL_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new TRIBAL_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT);
  });

  it('#generateContributionPurposeDescription() should return constant', () => {
    const descrip = transactionType.generateContributionPurposeDescription();
    expect(descrip).toBe('Recount Account');
  });
});
