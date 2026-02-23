import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT } from './OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT.model';

describe('OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT', () => {
  let transactionType: OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT);
  });

  it('#generatePurposeDescription() should be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Reimbursement: See Below');
  });
});
