import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchFTransaction } from '../transaction/schedule-f/schf-transaction.model';
import { COORDINATED_PARTY_EXPENDITURE } from './COORDINATED_PARTY_EXPENDITURE.model';
import { ScheduleFTransactionTypes } from '../transaction/schedule-f/schedule-f-transaction-types.model';

describe('COORDINATED_PARTY_EXPENDITURE', () => {
  let transactionType: COORDINATED_PARTY_EXPENDITURE;

  beforeEach(() => {
    transactionType = new COORDINATED_PARTY_EXPENDITURE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('F');
  });

  it('#factory() should return a SchFTransaction', () => {
    const txn: SchFTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SF');
    expect(txn.transaction_type_identifier).toBe(ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
