import { PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT } from './PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT', () => {
  let transactionType: PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    transactionType.transaction = transactionType.getNewTransaction();
    let descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account (Partnership attributions do not require itemization)');

    transactionType.transaction.children = [transactionType.getNewTransaction()];
    descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount Account (See Partnership Attribution(s) below)');
  });
});
