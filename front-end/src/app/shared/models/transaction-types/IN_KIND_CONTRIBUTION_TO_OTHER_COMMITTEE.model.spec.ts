import { TransactionType } from 'app/shared/models/transaction/transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE } from './IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE', () => {
  let transactionType: IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE;

  beforeEach(() => {
    transactionType = new IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE);
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect((transactionType as TransactionType).generatePurposeDescription).toBe(undefined);
  });
});
