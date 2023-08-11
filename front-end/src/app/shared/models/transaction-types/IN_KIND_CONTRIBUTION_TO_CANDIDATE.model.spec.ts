import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { IN_KIND_CONTRIBUTION_TO_CANDIDATE } from './IN_KIND_CONTRIBUTION_TO_CANDIDATE.model';

describe('IN_KIND_CONTRIBUTION_TO_CANDIDATE', () => {
  let transactionType: IN_KIND_CONTRIBUTION_TO_CANDIDATE;

  beforeEach(() => {
    transactionType = new IN_KIND_CONTRIBUTION_TO_CANDIDATE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
