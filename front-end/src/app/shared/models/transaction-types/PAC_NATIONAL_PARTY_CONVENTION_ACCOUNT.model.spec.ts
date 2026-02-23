import { PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT } from './PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';

describe('PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT', () => {
  let transactionType: PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Pres. Nominating Convention Account');
  });
});
