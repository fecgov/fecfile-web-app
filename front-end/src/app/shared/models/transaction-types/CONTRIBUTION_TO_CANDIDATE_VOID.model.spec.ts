import { TransactionType } from 'app/shared/models/transaction-type.model';
import { CONTRIBUTION_TO_CANDIDATE_VOID } from './CONTRIBUTION_TO_CANDIDATE_VOID.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';

describe('CONTRIBUTION_TO_CANDIDATE_VOID', () => {
  let transactionType: CONTRIBUTION_TO_CANDIDATE_VOID;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_CANDIDATE_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
