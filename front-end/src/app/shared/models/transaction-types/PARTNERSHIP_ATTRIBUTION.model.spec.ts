import { PARTNERSHIP_ATTRIBUTION } from './PARTNERSHIP_ATTRIBUTION.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('PARTNERSHIP_ATTRIBUTION', () => {
  let transactionType: PARTNERSHIP_ATTRIBUTION;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_ATTRIBUTION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Partnership Attribution');
  });
});
