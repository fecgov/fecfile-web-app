import { OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT } from './OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a.model';

describe('OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT', () => {
  let transactionType: OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT);
  });

  it('#generatePurposeDescription() should be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Reimbursement: See Below');
  });
});
