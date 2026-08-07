import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';
import { OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT } from './OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT.model';

describe('OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT', () => {
  let transactionType: OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT;

  beforeEach(() => {
    transactionType = new OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchBTransaction', () => {
    const txn: SchBTransaction = transactionType.getNewTransaction();
    expect(txn.form_type).toBe('SB21B');
    expect(txn.transaction_type_identifier).toBe(
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
    );
  });

  it('#generatePurposeDescription() should not be defined', () => {
    expect(transactionType.generatePurposeDescription()).toBe('Pres. Nominating Convention Account: Refund');
  });
});
