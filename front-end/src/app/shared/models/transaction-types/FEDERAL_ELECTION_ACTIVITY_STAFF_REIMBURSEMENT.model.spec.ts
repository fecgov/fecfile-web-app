import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a.model';
import { FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT } from './FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT.model';

describe('FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT
    );
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Reimbursement: See Below');
  });
});
