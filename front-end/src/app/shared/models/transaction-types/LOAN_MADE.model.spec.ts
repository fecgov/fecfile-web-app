import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { LOAN_MADE } from './LOAN_MADE.model';

describe('LOAN_MADE', () => {
  let transactionType: LOAN_MADE;

  beforeEach(() => {
    transactionType = new LOAN_MADE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB27');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.LOAN_MADE);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
