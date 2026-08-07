import { OTHER_DISBURSEMENT } from './OTHER_DISBURSEMENT.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

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
