import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a.model';
import { INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT } from './INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT.model';

describe('INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  xit('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    const descrip = transactionType.generatePurposeDescription();
    expect(descrip).toBe('Non-contribution Account Refund');
  });
});
