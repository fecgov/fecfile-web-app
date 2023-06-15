import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupL } from '../transaction-groups/transaction-group-l.model';
import { CONTRIBUTION_TO_CANDIDATE_VOID } from './CONTRIBUTION_TO_CANDIDATE_VOID.model';

describe('CONTRIBUTION_TO_CANDIDATE_VOID', () => {
  let transactionType: CONTRIBUTION_TO_CANDIDATE_VOID;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_CANDIDATE_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupL);
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
