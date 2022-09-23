import { EAR_REC } from './EAR_REC.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('EAR_REC', () => {
  let transactionType: EAR_REC;

  beforeEach(() => {
    transactionType = new EAR_REC();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('AG');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.EARMARK_RECEIPT);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
