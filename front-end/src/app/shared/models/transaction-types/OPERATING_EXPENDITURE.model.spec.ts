import { OPERATING_EXPENDITURE } from './OPERATING_EXPENDITURE.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b';

describe('OPERATING_EXPENDITURE', () => {
  let transactionType: OPERATING_EXPENDITURE;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE(new TransactionGroupB());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
