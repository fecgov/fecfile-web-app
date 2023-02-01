import { PARTNERSHIP_RECEIPT } from './PARTNERSHIP_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_RECEIPT', () => {
  let transactionType: PARTNERSHIP_RECEIPT;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  });

  it('#purposeDescriptionGenerator() should generate a string', () => {
    transactionType.transaction = transactionType.getNewTransaction();
    let descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Partnership attributions do not require itemization');

    transactionType.transaction.children = [transactionType.getNewTransaction()];
    descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('See Partnership Attribution(s) below');
  });
});
