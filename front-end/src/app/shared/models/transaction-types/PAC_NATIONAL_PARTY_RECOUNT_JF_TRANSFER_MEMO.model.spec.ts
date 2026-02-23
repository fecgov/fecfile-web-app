import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { SchATransaction } from '../scha-transaction.model';
import { ScheduleATransactionTypes } from '../type-enums';
import { PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO } from './PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model';

describe('PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO', () => {
  let transactionType: PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO;

  beforeEach(() => {
    transactionType = new PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('A');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SA17');
    expect(txn.transaction_type_identifier).toBe(ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO);
  });

  it('#generatePurposeDescription() should generate a string', async () => {
    const txn = (await TransactionUtils.createNewTransaction(transactionType)) as SchATransaction;
    txn.parent_transaction = { contributor_organization_name: 'Test Org' } as SchATransaction;
    const descrip = transactionType.generatePurposeDescription(txn);
    expect(descrip).toBe('Recount/Legal Proceedings Account JF Memo: Test Org');
  });
});
