import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT } from './NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT.model';

describe('NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT', () => {
  let transactionType: NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT;

  beforeEach(() => {
    transactionType = new NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT);
  });

  it('#generatePurposeDescription() should be undefined', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
