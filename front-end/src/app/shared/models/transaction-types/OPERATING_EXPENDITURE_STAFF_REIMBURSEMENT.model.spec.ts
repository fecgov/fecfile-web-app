import { OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT } from './OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';

describe('OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT', () => {
  let transactionType: OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT);
  });

  it('#generatePurposeDescription() should be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Reimbursement: See Below');
  });
});
