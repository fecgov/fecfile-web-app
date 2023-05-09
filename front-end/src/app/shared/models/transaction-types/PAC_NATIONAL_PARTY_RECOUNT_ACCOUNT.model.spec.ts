import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT } from './PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';

describe('PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT', () => {
  let transactionType: PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchATransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Recount/Legal Proceedings Account');
  });
});
