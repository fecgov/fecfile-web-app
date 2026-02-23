import { TransactionType } from 'app/shared/models/transaction-type.model';
import { COORDINATED_PARTY_EXPENDITURE } from './COORDINATED_PARTY_EXPENDITURE.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleFTransactionTypes } from '../type-enums';

describe('COORDINATED_PARTY_EXPENDITURE', () => {
  let transactionType: COORDINATED_PARTY_EXPENDITURE;

  beforeEach(() => {
    transactionType = new COORDINATED_PARTY_EXPENDITURE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('F');
  });

  it('#factory() should return a SchFTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SF');
    expect(txn.transaction_type_identifier).toBe(ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
