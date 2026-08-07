import { DEBT_OWED_BY_COMMITTEE } from './DEBT_OWED_BY_COMMITTEE.model';
import { SchDTransaction } from '../transaction/schedule-d/schd-transaction.model';
import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { ScheduleDTransactionTypes } from '../transaction/schedule-d/schedule-d-transaction-types.model';

describe('DEBT_OWED_BY_COMMITTEE', () => {
  let transactionType: DEBT_OWED_BY_COMMITTEE;

  beforeEach(() => {
    transactionType = new DEBT_OWED_BY_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('D');
  });

  it('#factory() should return a SchDTransaction', () => {
    const txn: SchDTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SD10');
    expect(txn.transaction_type_identifier).toBe(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
