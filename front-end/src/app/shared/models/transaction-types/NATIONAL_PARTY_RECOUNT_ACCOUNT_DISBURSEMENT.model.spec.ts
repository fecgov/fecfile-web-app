import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';
import { NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT } from './NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT.model';

describe('NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT', () => {
  let transactionType: NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT;

  beforeEach(() => {
    transactionType = new NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupB);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT);
  });

  it('#generatePurposeDescription() should be undefined', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
