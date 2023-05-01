import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT } from './NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT.model';

describe('NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT);
  });

  it('#generatePurposeDescription() should be undefined', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
