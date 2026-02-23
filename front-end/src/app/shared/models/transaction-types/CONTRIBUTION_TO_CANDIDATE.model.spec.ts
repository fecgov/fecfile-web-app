import { TransactionType } from 'app/shared/models/transaction-type.model';
import { CONTRIBUTION_TO_CANDIDATE } from './CONTRIBUTION_TO_CANDIDATE.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';

describe('CONTRIBUTION_TO_CANDIDATE', () => {
  let transactionType: CONTRIBUTION_TO_CANDIDATE;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_CANDIDATE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
