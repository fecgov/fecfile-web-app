import { TransactionType } from 'app/shared/models/transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE } from './CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE.model';

describe('CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE', () => {
  let transactionType: CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_FEDERAL_COMMITTEE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
