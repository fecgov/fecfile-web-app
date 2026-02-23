import { PARTNERSHIP_ATTRIBUTION } from './PARTNERSHIP_ATTRIBUTION.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('PARTNERSHIP_ATTRIBUTION', () => {
  let transactionType: PARTNERSHIP_ATTRIBUTION;

  beforeEach(() => {
    transactionType = new PARTNERSHIP_ATTRIBUTION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA11AI');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Partnership Attribution');
  });
});
