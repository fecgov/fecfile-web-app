import { OFFSET_TO_OPERATING_EXPENDITURES } from './OFFSET_TO_OPERATING_EXPENDITURES.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('OFFSET_TO_OPERATING_EXPENDITURES', () => {
  let transactionType: OFFSET_TO_OPERATING_EXPENDITURES;

  beforeEach(() => {
    transactionType = new OFFSET_TO_OPERATING_EXPENDITURES();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA15');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
