import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { OPERATING_EXPENDITURE } from './OPERATING_EXPENDITURE.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';

describe('OPERATING_EXPENDITURE', () => {
  let transactionType: OPERATING_EXPENDITURE;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
