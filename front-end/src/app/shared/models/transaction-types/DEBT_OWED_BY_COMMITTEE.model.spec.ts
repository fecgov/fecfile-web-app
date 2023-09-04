import { DEBT_OWED_BY_COMMITTEE } from './DEBT_OWED_BY_COMMITTEE.model';
import { SchDTransaction, ScheduleDTransactionTypes } from '../schd-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';

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
