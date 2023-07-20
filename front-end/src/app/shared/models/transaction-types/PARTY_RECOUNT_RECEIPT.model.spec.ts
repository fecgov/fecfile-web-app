import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTY_RECOUNT_RECEIPT } from './PARTY_RECOUNT_RECEIPT.model';

describe('PARTY_RECOUNT_RECEIPT', () => {
  let transactionType: PARTY_RECOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new PARTY_RECOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should return appropriate retval', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe(`Recount Account`);
  });
});
