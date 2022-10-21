import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { PARTY_RECEIPT } from './PARTY_RECEIPT.model';

describe('PARTY_RECEIPT', () => {
  let transactionType: PARTY_RECEIPT;

  beforeEach(() => {
    transactionType = new PARTY_RECEIPT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('F');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11B');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_RECEIPT);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
