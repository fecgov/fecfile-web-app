import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';
import { NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT } from './NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT.model';

describe('NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT', () => {
  let transactionType: NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT;

  beforeEach(() => {
    transactionType = new NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT);
  });

  it('#generatePurposeDescription() should be undefined', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
