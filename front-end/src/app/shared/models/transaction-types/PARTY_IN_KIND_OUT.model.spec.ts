import { PARTY_IN_KIND_OUT } from './PARTY_IN_KIND_OUT.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { ScheduleBTransactionTypes } from '../transaction/schedule-b/schedule-b-transaction-types.model';

describe('IN_KIND_OUT', () => {
  let transactionType: PARTY_IN_KIND_OUT;

  beforeEach(() => {
    transactionType = new PARTY_IN_KIND_OUT();
  });

  it('should create an instance', () => {
    expect(transactionType).toBeTruthy();
    expect(transactionType.scheduleId).toBe('B');
  });

  it('#factory() should return a SchATransaction', () => {
    const transaction: SchBTransaction = transactionType.getNewTransaction();
    expect(transaction.form_type).toBe('SB21B');
    expect(transaction.transaction_type_identifier).toBe(ScheduleBTransactionTypes.PARTY_IN_KIND_OUT);
  });

  it('#generatePurposeDescription() should generate a string', () => {
    expect(transactionType?.generatePurposeDescription).toBeUndefined();
  });
});
