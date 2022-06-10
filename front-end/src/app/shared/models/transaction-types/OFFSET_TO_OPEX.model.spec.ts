import { OFFSET_TO_OPEX } from './OFFSET_TO_OPEX.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';

describe('OFFSET_TO_OPEX', () => {
  let transactionType: OFFSET_TO_OPEX;

  beforeEach(() => {
    transactionType = new OFFSET_TO_OPEX();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.componentGroupId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA15');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.OFFSETS_TO_OPERATING_EXPENDITURES);
  });

  it('#contributionPurposeDescripReadonly() should return an empty string', () => {
    const descrip = transactionType.contributionPurposeDescripReadonly();
    expect(descrip).toBe('');
  });
});
