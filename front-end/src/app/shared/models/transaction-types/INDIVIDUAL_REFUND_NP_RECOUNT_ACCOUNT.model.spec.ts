import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupA } from '../transaction-groups/transaction-group-a';
import { INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT } from './INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT.model';

describe('INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT', () => {
  let transactionType: INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT(new TransactionGroupA());
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.transactionGroup).toBeInstanceOf(TransactionGroupA);
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT);
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Recount/Legal Proceedings Account: Refund');
  });
});
