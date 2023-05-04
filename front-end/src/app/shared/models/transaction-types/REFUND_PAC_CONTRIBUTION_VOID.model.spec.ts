import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';
import { REFUND_PAC_CONTRIBUTION_VOID } from './REFUND_PAC_CONTRIBUTION_VOID.model';

describe('REFUND_PAC_CONTRIBUTION_VOID', () => {
  let transactionType: REFUND_PAC_CONTRIBUTION_VOID;

  beforeEach(() => {
    transactionType = new REFUND_PAC_CONTRIBUTION_VOID();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupE);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB28C');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID);
  });

  it('#generatePurposeDescription() should return constant', () => {
    const descrip = transactionType.generatePurposeDescription;
    expect(descrip).toBe(undefined);
  });
});
