import { C2_LOAN_GUARANTOR } from './C2_LOAN_GUARANTOR.model';
import { SchC2Transaction } from '../schc2-transaction.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleC2TransactionTypes } from '../type-enums';

describe('C2_LOAN_GUARANTOR', () => {
  let transactionType: C2_LOAN_GUARANTOR;

  beforeEach(() => {
    transactionType = new C2_LOAN_GUARANTOR();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('C2');
  });

  it('#factory() should return a SchC2Transaction', async () => {
    const transaction: SchC2Transaction = (await TransactionUtils.createNewTransaction(
      transactionType,
    )) as SchC2Transaction;
    expect(transaction.form_type).toBe('SC2/10');
    expect(transaction.transaction_type_identifier).toBe(ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
