import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { FEDERAL_ELECTION_ACTIVITY_VOID } from './FEDERAL_ELECTION_ACTIVITY_VOID.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('FEDERAL_ELECTION_ACTIVITY_VOID', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_VOID;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
