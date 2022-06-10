import { OTH_REC } from './OTH_REC.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('OTH_REC', () => {
  let transactionType: OTH_REC;

  beforeEach(() => {
    transactionType = new OTH_REC();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('C');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.OTHER_RECEIPTS);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
