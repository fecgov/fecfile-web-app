import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleATransactionTypes } from '../type-enums';
import { TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT } from './TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model';

describe('TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT', () => {
  let transactionType: TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT;

  beforeEach(() => {
    transactionType = new TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Headquarters Buildings Account');
  });
});
