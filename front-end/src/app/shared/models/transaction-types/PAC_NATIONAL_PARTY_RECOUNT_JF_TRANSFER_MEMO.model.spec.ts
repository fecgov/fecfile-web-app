import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO } from './PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model';

describe('PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO', () => {
  let transactionType: PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchATransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SA17');
    expect(transaction.transaction_type_identifier).toBe(
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO
    );
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const transaction: SchATransaction = transactionType.getNewTransaction();
    transaction.parent_transaction = { contributor_organization_name: 'Test Org' } as SchATransaction;
    const descrip = transactionType.generatePurposeDescription(transaction);
    expect(descrip).toBe('Recount/Legal Proceedings Account JF Memo: Test Org');
  });
});
