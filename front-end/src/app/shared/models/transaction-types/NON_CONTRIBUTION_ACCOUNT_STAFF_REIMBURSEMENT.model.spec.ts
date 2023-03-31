import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT } from './NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT.model';

describe('NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-Contribution Account - Reimbursement: See Below');
  });
});
