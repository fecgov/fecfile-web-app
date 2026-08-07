import { OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT } from './OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT', () => {
  let transactionType: OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT;

  beforeEach(() => {
    transactionType = new OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT);
  });

  it('#generatePurposeDescription() should be defined', () => {
    const txn = transactionType.getNewTransaction();
    expect(transactionType.generatePurposeDescription(txn)).toBe(
      'Reimbursement memo entries do not meet itemization threshold.',
    );
    txn.children = [
      {
        itemized: true,
      } as SchBTransaction,
    ];
    expect(transactionType.generatePurposeDescription(txn)).toBe('Reimbursement Memo: See Below');
  });
});
