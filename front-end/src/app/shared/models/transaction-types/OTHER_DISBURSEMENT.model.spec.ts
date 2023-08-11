import { OTHER_DISBURSEMENT } from './OTHER_DISBURSEMENT.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';

describe('OTHER_DISBURSEMENT', () => {
  let transactionType: OTHER_DISBURSEMENT;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
