import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { CONTRIBUTION_TO_OTHER_COMMITTEE } from './CONTRIBUTION_TO_OTHER_COMMITTEE.model';

describe('CONTRIBUTION_TO_OTHER_COMMITTEE', () => {
  let transactionType: CONTRIBUTION_TO_OTHER_COMMITTEE;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_OTHER_COMMITTEE();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
