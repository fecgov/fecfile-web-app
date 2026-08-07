import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { CONTRIBUTION_TO_CANDIDATE } from './CONTRIBUTION_TO_CANDIDATE.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('CONTRIBUTION_TO_CANDIDATE', () => {
  let transactionType: CONTRIBUTION_TO_CANDIDATE;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_CANDIDATE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
