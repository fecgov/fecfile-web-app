import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { INDIVIDUAL_REFUND_NP_RECOUNT } from './INDIVIDUAL_REFUND_NP_RECOUNT.model';

describe('INDIVIDUAL_REFUND_NP_RECOUNT', () => {
  let transactionType: INDIVIDUAL_REFUND_NP_RECOUNT;

  beforeEach(() => {
    transactionType = new INDIVIDUAL_REFUND_NP_RECOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
    expect(transactionType.componentGroupId).toBe('A');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB29');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT);
  });

  it('#generatePurposeDescription() should be the correct value', () => {
    expect(transactionType.generatePurposeDescription()).toBe(
      "Recount/Legal Proceedings Account: Refund");
  });
});
