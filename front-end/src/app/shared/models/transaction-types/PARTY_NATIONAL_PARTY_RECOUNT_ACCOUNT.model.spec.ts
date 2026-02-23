import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';

describe('PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount/Legal Proceedings Account');
  });
});
