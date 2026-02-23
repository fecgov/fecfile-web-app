import { TransactionType } from 'app/shared/models/transaction-type.model';
import { IN_KIND_CONTRIBUTION_TO_CANDIDATE } from './IN_KIND_CONTRIBUTION_TO_CANDIDATE.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';

describe('IN_KIND_CONTRIBUTION_TO_CANDIDATE', () => {
  let transactionType: IN_KIND_CONTRIBUTION_TO_CANDIDATE;

  beforeEach(() => {
    transactionType = new IN_KIND_CONTRIBUTION_TO_CANDIDATE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
