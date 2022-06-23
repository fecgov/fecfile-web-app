import { TRIB_REC } from './TRIB_REC.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('TRIB_REC', () => {
  let transactionType: TRIB_REC;

  beforeEach(() => {
    transactionType = new TRIB_REC();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('D');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11a');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_RECEIPT);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('Tribal Receipt');
  });
});
