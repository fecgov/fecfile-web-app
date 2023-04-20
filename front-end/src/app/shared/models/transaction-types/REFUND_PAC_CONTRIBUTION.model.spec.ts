import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { REFUND_PAC_CONTRIBUTION } from './REFUND_PAC_CONTRIBUTION.model';

describe('REFUND_PAC_CONTRIBUTION', () => {
  let transactionType: REFUND_PAC_CONTRIBUTION;

  beforeEach(() => {
    transactionType = new REFUND_PAC_CONTRIBUTION();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('E');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28C');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
