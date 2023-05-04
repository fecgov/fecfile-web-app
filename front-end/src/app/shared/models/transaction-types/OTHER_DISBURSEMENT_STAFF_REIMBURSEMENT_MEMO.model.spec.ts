import { OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO } from './OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionType } from 'app/shared/models/transaction-type.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b';

describe('OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO', () => {
  let transactionType: OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO(new TransactionGroupB());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
