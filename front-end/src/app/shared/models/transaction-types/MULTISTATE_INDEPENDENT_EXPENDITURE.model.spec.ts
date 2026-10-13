import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchETransaction, ScheduleETransactionTypes } from '../sche-transaction.model';
import { MULTISTATE_INDEPENDENT_EXPENDITURE } from './MULTISTATE_INDEPENDENT_EXPENDITURE.model';

describe('MULTISTATE_INDEPENDENT_EXPENDITURE', () => {
  let transactionType: MULTISTATE_INDEPENDENT_EXPENDITURE;

  beforeEach(() => {
    transactionType = new MULTISTATE_INDEPENDENT_EXPENDITURE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('E');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchETransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SE');
    expect(txn.transaction_type_identifier).toBe(ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
