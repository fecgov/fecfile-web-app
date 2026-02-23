import { TransactionType } from 'app/shared/models/transaction-type.model';
import { FEDERAL_ELECTION_ACTIVITY_VOID } from './FEDERAL_ELECTION_ACTIVITY_VOID.model';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { ScheduleBTransactionTypes } from '../type-enums';

describe('FEDERAL_ELECTION_ACTIVITY_VOID', () => {
  let transactionType: FEDERAL_ELECTION_ACTIVITY_VOID;

  beforeEach(() => {
    transactionType = new FEDERAL_ELECTION_ACTIVITY_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', async () => {
    const txn = await TransactionUtils.createNewTransaction(transactionType);
    expect(txn.form_type).toBe('SB30B');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
