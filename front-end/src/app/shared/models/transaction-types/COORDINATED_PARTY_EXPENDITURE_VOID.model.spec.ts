import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchFTransaction, ScheduleFTransactionTypes } from '../schf-transaction.model';
import { COORDINATED_PARTY_EXPENDITURE_VOID } from './COORDINATED_PARTY_EXPENDITURE_VOID.model';

describe('COORDINATED_PARTY_EXPENDITURE_VOID', () => {
  let transactionType: COORDINATED_PARTY_EXPENDITURE_VOID;

  beforeEach(() => {
    transactionType = new COORDINATED_PARTY_EXPENDITURE_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('F');
  });

  it('#factory() should return a SchFTransaction', () => {
    const txn: SchFTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SF');
    expect(txn.transaction_type_identifier).toBe(ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
