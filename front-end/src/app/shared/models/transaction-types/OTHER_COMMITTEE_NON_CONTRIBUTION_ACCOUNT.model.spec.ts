import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT } from './OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT.model';

describe('OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT', () => {
  let transactionType: OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    );
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account');
  });
});
