import { TRIBAL_RECEIPT } from './TRIBAL_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('TRIBAL_RECEIPT', () => {
  let transactionType: TRIBAL_RECEIPT;

  beforeEach(() => {
    transactionType = new TRIBAL_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_RECEIPT);
  });

  it('#purposeDescriptionGenerator() should generate a string', () => {
    const descrip = transactionType.purposeDescriptionGenerator();
    expect(descrip).toBe('Tribal Receipt');
  });
});
