import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { CONTRIBUTION_TO_OTHER_COMMITTEE_VOID } from './CONTRIBUTION_TO_OTHER_COMMITTEE_VOID.model';

describe('CONTRIBUTION_TO_OTHER_COMMITTEE_VOID', () => {
  let transactionType: CONTRIBUTION_TO_OTHER_COMMITTEE_VOID;

  beforeEach(() => {
    transactionType = new CONTRIBUTION_TO_OTHER_COMMITTEE_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB23');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
