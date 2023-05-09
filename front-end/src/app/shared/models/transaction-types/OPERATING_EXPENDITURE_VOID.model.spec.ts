import { OPERATING_EXPENDITURE_VOID } from './OPERATING_EXPENDITURE_VOID.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';

describe('OPERATING_EXPENDITURE_VOID', () => {
  let transactionType: OPERATING_EXPENDITURE_VOID;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
