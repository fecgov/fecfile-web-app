import { INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT } from './INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    );
  });

  it('#generatePurposeDescription()', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Pres. Nominating Convention Account');
  });
});
